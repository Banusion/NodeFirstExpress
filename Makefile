FIG=docker-compose
RUN=$(FIG) run --rm app
EXEC=$(FIG) exec app
BASH=/bin/bash
GCLOUD_PROJECT:=$(shell gcloud config list project --format="value(core.project)")
ifeq ($(GCLOUD_PROJECT),homeserve-preprod)
SYSTEM=-preprod
endif
ifeq ($(GCLOUD_PROJECT),homeserve-test-205811)
SYSTEM=-test
endif

help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

environnement:
	echo $(SYSTEM)

##
## Project setup
##---------------------------------------------------------------------------
.PHONY: up
up:
	$(FIG) up -d

.PHONY: up-i
up-i:
	$(FIG) up

.PHONY: up-build
up-build:
	$(FIG) build --no-cache --force-rm
	$(FIG) up -d

.PHONY: down
down:
	$(FIG) down

.PHONY: mount
mount:
	$(RUN) $(BASH)

.PHONY: logs
logs:
	$(FIG) logs -f web

.PHONY: build-prod
build-prod:
	$(RUN) npm run build

.PHONY: run-prod
run-prod:
	$(FIG) run --rm -p 3000:8069 app npm run prod

.PHONY: lint
lint:
	$(RUN) npm run lint

.PHONY: list
list:
	$(FIG) ps

.PHONY: clean
clean:
	docker system prune -f

## to build and run container in production

.PHONY: build-k8s
build-k8s: build-prod
	docker build -f ./Dockerfile.prod -t gcr.io/$(GCLOUD_PROJECT)/sms${VERSION} .

.PHONY: run-k8s
run-k8s:
	docker run -p 3000:8069 gcr.io/$(GCLOUD_PROJECT/sms:latest

## One time only
.PHONY: create-cluster
create-cluster:
	gcloud container clusters create cluster-homeserve-test --zone europe-west1-b --machine-type "custom-1-2048" --num-nodes "2" --enable-autoscaling --min-nodes 1 --max-nodes 4

.PHONY: delete-cluster
delete-cluster:
	gcloud container clusters delete sms$(SYSTEM) --zone europe-west1-b

.PHONY: set-cluster
set-cluster:
	gcloud container clusters get-credentials sms$(SYSTEM) --zone europe-west1-b

.PHONY: set-project
set-project:
	gcloud config set project homeserve$(SYSTEM)

.PHONY: create-bucket
create-bucket:
	gsutil mb gs://sms$(SYSTEM)

.PHONY: push-sms
push-sms: build-k8s
	gcloud docker -- push gcr.io/$(GCLOUD_PROJECT)/sms${VERSION}

## Use apply to update easily
.PHONY: deploy
deploy:
	kubectl create -f ./app/config/deploy/sms$(SYSTEM).yaml --record

.PHONY: delete
delete:
	kubectl delete -f ./app/config/deploy/sms$(SYSTEM).yaml

.PHONY: info
info:
	kubectl get pods
	kubectl get services

.PHONY: update
update:
	kubectl apply -f ./app/config/deploy/sms$(SYSTEM).yaml

.PHONY: update-history
update-history:
	kubectl rollout history sms$(SYSTEM)

.PHONY: undo
undo:
	kubectl rollout undo sms$(SYSTEM)

.PHONY: undo-to
undo-to:
	kubectl rollout undo sms$(SYSTEM) --to-revision=${REVISION}

.PHONY: get-credentials
get-credentials:
	gcloud container clusters get-credentials cluster --zone europe-west1-b

.PHONY: get-pods
get-pods:
	kubectl get pods

##
## TESTS
##---------------------------------------------------------------------------

.PHONY: test
test: up
	$(RUN) npm test

##
## Dependencies
##---------------------------------------------------------------------------

node_modules:
	$(EXEC) npm install
install:
	$(EXEC) npm install $(MOD) -S
install-dev:
	$(EXEC) npm install $(MOD) --save-dev
