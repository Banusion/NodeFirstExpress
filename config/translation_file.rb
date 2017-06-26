table "messages" do
	column "id", :key, :as => :integer
	column "content", :string
	column "created_at", :datetime
end

