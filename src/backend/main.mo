import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Order "mo:core/Order";

actor {
  type Enquiry = {
    id : Nat;
    timestamp : Time.Time;
    name : Text;
    company : Text;
    phone : Text;
    email : Text;
    message : Text;
  };

  module Enquiry {
    public func compare(enquiry1 : Enquiry, enquiry2 : Enquiry) : Order.Order {
      Nat.compare(enquiry1.id, enquiry2.id);
    };
  };

  var nextEnquiryId = 0;
  let enquiries = Map.empty<Nat, Enquiry>();

  public shared ({ caller }) func submitEnquiry(name : Text, company : Text, phone : Text, email : Text, message : Text) : async () {
    if (caller.isAnonymous() == false) { Runtime.trap("Enquiries can only be submitted anonymously.") };
    let enquiryId = nextEnquiryId;
    nextEnquiryId += 1;
    let enquiry : Enquiry = {
      id = enquiryId;
      timestamp = Time.now();
      name;
      company;
      phone;
      email;
      message;
    };
    enquiries.add(enquiryId, enquiry);
  };

  public query ({ caller }) func getAllEnquiries() : async [Enquiry] {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous users are not authorized to access this information.") };
    let unsortedEnquiries = enquiries.values().toArray();
    unsortedEnquiries.sort();
  };

  public query ({ caller }) func getEnquiry(email : Text) : async Enquiry {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous users are not authorized to access this information.") };
    let matchingEnquiry = enquiries.values().find(func(enq) { enq.email == email });
    switch (matchingEnquiry) {
      case (null) { Runtime.trap("Enquiry does not exist") };
      case (?enquiry) { enquiry };
    };
  };
};
