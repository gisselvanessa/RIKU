export class Location {
  address: string;
  city: string;
  parish: string;
  province: string;
}

export class UserProfile {
    user_id: string;
    country_code: string;
    first_name: string;
    last_name: string;
    mobile_no: string;
    profile_pic: string;
    additional_address: string;
    address: Location;
    ratings: {
        ratingInStar: string;
        totalRatings: string;
    };
    type: Array<string>;
}
