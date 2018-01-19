class LabSessionSerializer < ActiveModel::Serializer
  attribute :description
  attribute :token
  attribute :active

  has_many :questions
  has_many :users
end
