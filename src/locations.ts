import buildUrl from "build-url";
import { EventLocation } from "./routes/contract";

export const buildMapsUrl = (location: EventLocation): string => {
  // translate blank name to no location in sched
  if (location.name === "") return "";

  let params: Record<string, string | string[]> = {
    api: "1",
  };
  if (location.maps_query !== undefined && location.maps_query !== "") {
    params = { ...params, query: location.maps_query };
  } else if (
    location.maps_description !== undefined &&
    location.maps_description !== ""
  ) {
    params = { ...params, query: location.maps_description };
  } else {
    params = { ...params, query: `${location.name} Madison, WI` };
  }
  if (location.maps_placeid !== undefined && location.maps_placeid !== "") {
    params = { ...params, query_place_id: location.maps_placeid };
  }
  return buildUrl("https://www.google.com/", {
    path: "maps/search/",
    queryParams: params,
  });
};

export const locations: EventLocation[] = [
  {
    name: "Warner Park @ Forster Dr",
    sched_address: "2930 N Sherman Ave, Madison, WI 53704",
    maps_query: "43.1330677130937, -89.37302929269123",
  },
  {
    name: "Fire Station #9 Lawn (please ask Madison Bikes for assistance)",
    sched_venue: "Fire Station #9",
    sched_address: "201 N Midvale Blvd, Madison, WI 53705",
    maps_query: "43.06825658346771, -89.45017880206065",
  },
  {
    name: "The Velo UnderRound",
    sched_address: "4789 Crescent Rd, Madison, WI 53711, USA",
    maps_query: "43.02384174161428, -89.46118663604771",
    maps_placeid: "ChIJtTh2R_GtB4gR3FXbJot9IvU",
  },
  {
    name: "Capital City Path @ Jackson St",
    maps_query: "43.09362734540651, -89.3487495229572",
  },
  {
    name: "Capital City Path @ E Wilson/Ingersoll",
    maps_query: "43.08226898474152, -89.36764332963402",
    sched_address: "1050 Capital City Trail, Madison, WI 53703",
  },
  {
    name: "Capital City Path @ Dickinson St",
    maps_query: "43.08649669029604, -89.36153934123017",
    sched_address: "301 S Dickinson St, Madison, WI 53703, USA",
  },
  {
    name: "Southwest Path @ Crazylegs Plaza",
    sched_address: "1605 Regent St, Madison, WI 53726",
    maps_query: "43.067625512497706, -89.41344863570794",
  },
  {
    name: "Capital City Path @ First St",
    maps_query: "43.0897922154192, -89.35602172894029",
  },
  {
    name: "Capital City Path @ Garver Feed Mill",
    maps_query: "43.09434025402559, -89.33485600010425",
    sched_address: "3241 Garver Green, Madison, WI 53704",
  },
  {
    name: "Capital City Path @ Law Park",
    sched_address: "410 S Blair St, Madison, WI 53703",
    maps_query: "43.068865430910314, -89.38371336452231",
  },
  {
    name: "Yahara River Path @ Tenney Park",
    maps_query: "43.09247834276359, -89.36698561492226",
  },
  {
    name: "Madison Municipal Building",
    sched_address: "215 Martin Luther King Jr Blvd, Madison, WI 53703",
    maps_query: "43.073056383370364, -89.38155318859431",
  },
  {
    name: "Brittingham Park",
    sched_address: "829 W. Washington Ave, Madison, WI",
    maps_query: "43.06333805116272, -89.39780739339082",
  },
  {
    name: "Starkweather Creek Path @ Commercial Ave",
    maps_query: "43.106834977626036, -89.34179850073251",
    sched_address: "2994 Commercial Ave, Madison, WI",
  },
  {
    name: "Capital City Path @ Dempsey Rd",
    maps_query: "43.08618421761168, -89.31618731793283",
  },
  {
    name: "Southwest Path @ Spring St/Charter St",
    maps_query: "43.06949884864831, -89.40600454474001",
  },
  {
    name: "Lussier Community Education Center",
    maps_query: "43.06630758865517, -89.50196921513945",
    sched_address: "55 S Gammon Rd, Madison, WI 53717",
  },
  {
    name: "Reynolds Park: N Paterson St @ E Mifflin St",
    maps_query: "43.08293952681019, -89.37557016431424",
  },
  {
    name: "Pinney Library",
    maps_query: "43.08433667433231, -89.31788920164708",
  },
  {
    name: "Burrows Park @ Harbort Dr",
    maps_query: "43.10167389021605, -89.36549950940855",
  },
  {
    name: "Cannonball Path @ Leopold Park",
    maps_query: "43.03022867622936, -89.41983600253485",
  },
  {
    name: "William Slater Park @ Segoe Rd/Tokay Blvd",
    maps_query: "43.053816772589244, -89.46474118090218",
  },
  {
    name: "Capital City Path @ Amoth Ct",
    sched_address: "Eastwood Dr & Amoth Ct, Madison, WI",
    maps_query: "43.09104576170086, -89.35365142809567",
  },
  {
    name: "Southwest Path @ Midvale Blvd",
    maps_query: "43.04631890556104, -89.4515052750167",
  },
  {
    name: "Southwest Path @ Hammersley Rd/Beltline",
    sched_address: "4717 Hammersley Rd, Madison, WI 53711, USA",
    maps_query: "43.03931326289994, -89.45981443133269",
  },
  {
    name: "Southwest Path @ Carling Dr",
    maps_query: "43.03089706471058, -89.46009832971829",
  },
  {
    name: "Wingra Creek Path @ Fish Hatchery Rd",
    maps_query: "43.0501333497925, -89.39995404541845",
  },
  {
    name: "Wingra Creek Path @ Olin Ave",
    maps_query: "43.05268012723853, -89.38292629027862",
  },
  {
    name: "Wingra Creek Path @ Arboretum",
    maps_query: "43.05692598905787, -89.40408758819244",
  },
  {
    name: "Starkweather Creek Path @ Darbo Dr",
    maps_query: "43.10366513048974, -89.34094395101857",
  },
  {
    name: "Southshore Bike Blvd @ Bernie’s Beach",
    maps_query: "43.05688298752837, -89.38944696431811",
  },
  {
    name: "Penn Park @ Fisher St",
    maps_query: "43.04254401115383, -89.39168911041875",
  },
  { name: "City-wide" },
  {
    name: "Other (describe below)",
  },
  {
    name: "Capital City Path @ Turville Park",
    sched_address: "1156 Olin-Turville Ct, Madison, WI 53715",
    maps_query: "43.05147728947594, -89.37757670676658",
  },
  {
    name: "Demetral Park: Scofield @ 8th St",
    maps_query: "43.10530918724534, -89.35279222722049",
  },
  {
    name: "Centro Hispano",
    maps_query: "43.03893771123766, -89.39540020253453",
  },
  {
    name: "Northside Farmers Market",
    maps_query: "43.12870776104843, -89.36315171787501",
  },
];
