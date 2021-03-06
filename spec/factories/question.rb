FactoryGirl.define do
  factory :question do
    text "Can I ask a question?"
    association :original_asker
    association :lab_session
    association :claimed_by, factory: :professor
    status "claimed"

    trait :unclaimed do
      claimed_by nil
      status "pending"
    end

    trait :unassigned do
      assigned_to nil
      status "pending"
    end

    trait :with_tags do
      tags { build_list(:tag, 2) }
    end

    after :create do |q|
      q.askers << q.original_asker
    end
  end
end
