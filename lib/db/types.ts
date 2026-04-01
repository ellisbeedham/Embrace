export type ClassSlot = {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  location: string;
  location_address: string;
  class_type: "boxing" | "muay_thai";
  capacity: number;
};

export type Booking = {
  id: string;
  user_id: string;
  class_slot_id: string;
  booking_date: string;
  status: "confirmed" | "cancelled";
  created_at: string;
  class_slots?: ClassSlot;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan_type: "trial" | "10class" | "unlimited";
  remaining_classes: number | null;
  valid_until: string | null;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
};
