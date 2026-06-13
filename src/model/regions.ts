import type { HenanCity, RegionOption } from "./types";

export const DEFAULT_REGION_ID = "china";

export const CHINA_REGION: RegionOption = {
  "id": "china",
  "adcode": "100000",
  "name": "全国",
  "shortName": "全国",
  "level": "country",
  "latitude": 35.8617,
  "longitude": 104.1954,
  "bounds": {
    "minLatitude": 3.823583,
    "maxLatitude": 53.563269,
    "minLongitude": 73.502355,
    "maxLongitude": 135.09567
  }
};

export const PROVINCE_REGIONS: RegionOption[] = [
  {
    "id": "110000",
    "adcode": "110000",
    "name": "北京市",
    "shortName": "北京",
    "level": "province",
    "longitude": 116.405285,
    "latitude": 39.904989,
    "bounds": {
      "minLatitude": 39.442597,
      "maxLatitude": 41.059394,
      "minLongitude": 115.426264,
      "maxLongitude": 117.514914
    }
  },
  {
    "id": "120000",
    "adcode": "120000",
    "name": "天津市",
    "shortName": "天津",
    "level": "province",
    "longitude": 117.190182,
    "latitude": 39.125596,
    "bounds": {
      "minLatitude": 38.556143,
      "maxLatitude": 40.252627,
      "minLongitude": 116.708034,
      "maxLongitude": 118.064948
    }
  },
  {
    "id": "130000",
    "adcode": "130000",
    "name": "河北省",
    "shortName": "河北",
    "level": "province",
    "longitude": 114.502461,
    "latitude": 38.045474,
    "bounds": {
      "minLatitude": 36.052155,
      "maxLatitude": 42.61847,
      "minLongitude": 113.465113,
      "maxLongitude": 119.872114
    }
  },
  {
    "id": "140000",
    "adcode": "140000",
    "name": "山西省",
    "shortName": "山西",
    "level": "province",
    "longitude": 112.549248,
    "latitude": 37.857014,
    "bounds": {
      "minLatitude": 34.583368,
      "maxLatitude": 40.737314,
      "minLongitude": 110.229584,
      "maxLongitude": 114.568877
    }
  },
  {
    "id": "150000",
    "adcode": "150000",
    "name": "内蒙古自治区",
    "shortName": "内蒙古",
    "level": "province",
    "longitude": 111.670801,
    "latitude": 40.818311,
    "bounds": {
      "minLatitude": 37.406618,
      "maxLatitude": 53.337314,
      "minLongitude": 97.172903,
      "maxLongitude": 126.068464
    }
  },
  {
    "id": "210000",
    "adcode": "210000",
    "name": "辽宁省",
    "shortName": "辽宁",
    "level": "province",
    "longitude": 123.429096,
    "latitude": 41.796767,
    "bounds": {
      "minLatitude": 38.721623,
      "maxLatitude": 43.489988,
      "minLongitude": 118.845959,
      "maxLongitude": 125.791291
    }
  },
  {
    "id": "220000",
    "adcode": "220000",
    "name": "吉林省",
    "shortName": "吉林",
    "level": "province",
    "longitude": 125.3245,
    "latitude": 43.886841,
    "bounds": {
      "minLatitude": 40.866877,
      "maxLatitude": 46.303668,
      "minLongitude": 121.644172,
      "maxLongitude": 131.31873
    }
  },
  {
    "id": "230000",
    "adcode": "230000",
    "name": "黑龙江省",
    "shortName": "黑龙江",
    "level": "province",
    "longitude": 126.642464,
    "latitude": 45.756967,
    "bounds": {
      "minLatitude": 43.425695,
      "maxLatitude": 53.563269,
      "minLongitude": 121.182217,
      "maxLongitude": 135.09567
    }
  },
  {
    "id": "310000",
    "adcode": "310000",
    "name": "上海市",
    "shortName": "上海",
    "level": "province",
    "longitude": 121.472644,
    "latitude": 31.231706,
    "bounds": {
      "minLatitude": 30.677191,
      "maxLatitude": 31.868458,
      "minLongitude": 120.859465,
      "maxLongitude": 122.122756
    }
  },
  {
    "id": "320000",
    "adcode": "320000",
    "name": "江苏省",
    "shortName": "江苏",
    "level": "province",
    "longitude": 118.767413,
    "latitude": 32.041544,
    "bounds": {
      "minLatitude": 30.757967,
      "maxLatitude": 35.124562,
      "minLongitude": 116.363724,
      "maxLongitude": 121.974931
    }
  },
  {
    "id": "330000",
    "adcode": "330000",
    "name": "浙江省",
    "shortName": "浙江",
    "level": "province",
    "longitude": 120.153576,
    "latitude": 30.287459,
    "bounds": {
      "minLatitude": 27.136016,
      "maxLatitude": 31.17875,
      "minLongitude": 118.027992,
      "maxLongitude": 122.836014
    }
  },
  {
    "id": "340000",
    "adcode": "340000",
    "name": "安徽省",
    "shortName": "安徽",
    "level": "province",
    "longitude": 117.283042,
    "latitude": 31.86119,
    "bounds": {
      "minLatitude": 29.395472,
      "maxLatitude": 34.650843,
      "minLongitude": 114.883006,
      "maxLongitude": 119.649144
    }
  },
  {
    "id": "350000",
    "adcode": "350000",
    "name": "福建省",
    "shortName": "福建",
    "level": "province",
    "longitude": 119.306239,
    "latitude": 26.075302,
    "bounds": {
      "minLatitude": 23.550379,
      "maxLatitude": 28.312047,
      "minLongitude": 115.855574,
      "maxLongitude": 120.461568
    }
  },
  {
    "id": "360000",
    "adcode": "360000",
    "name": "江西省",
    "shortName": "江西",
    "level": "province",
    "longitude": 115.892151,
    "latitude": 28.676493,
    "bounds": {
      "minLatitude": 24.48622,
      "maxLatitude": 30.076734,
      "minLongitude": 113.579062,
      "maxLongitude": 118.480091
    }
  },
  {
    "id": "370000",
    "adcode": "370000",
    "name": "山东省",
    "shortName": "山东",
    "level": "province",
    "longitude": 117.000923,
    "latitude": 36.675807,
    "bounds": {
      "minLatitude": 34.379134,
      "maxLatitude": 38.373393,
      "minLongitude": 114.818948,
      "maxLongitude": 122.714058
    }
  },
  {
    "id": "410000",
    "adcode": "410000",
    "name": "河南省",
    "shortName": "河南",
    "level": "province",
    "longitude": 113.665412,
    "latitude": 34.757975,
    "bounds": {
      "minLatitude": 31.383846,
      "maxLatitude": 36.366026,
      "minLongitude": 110.360779,
      "maxLongitude": 116.64336
    }
  },
  {
    "id": "420000",
    "adcode": "420000",
    "name": "湖北省",
    "shortName": "湖北",
    "level": "province",
    "longitude": 114.298572,
    "latitude": 30.584355,
    "bounds": {
      "minLatitude": 29.029307,
      "maxLatitude": 33.275484,
      "minLongitude": 108.371295,
      "maxLongitude": 116.13521
    }
  },
  {
    "id": "430000",
    "adcode": "430000",
    "name": "湖南省",
    "shortName": "湖南",
    "level": "province",
    "longitude": 112.982279,
    "latitude": 28.19409,
    "bounds": {
      "minLatitude": 24.637538,
      "maxLatitude": 30.126439,
      "minLongitude": 108.79075,
      "maxLongitude": 114.2529
    }
  },
  {
    "id": "440000",
    "adcode": "440000",
    "name": "广东省",
    "shortName": "广东",
    "level": "province",
    "longitude": 113.280637,
    "latitude": 23.125178,
    "bounds": {
      "minLatitude": 20.211691,
      "maxLatitude": 25.514031,
      "minLongitude": 109.655529,
      "maxLongitude": 117.192778
    }
  },
  {
    "id": "450000",
    "adcode": "450000",
    "name": "广西壮族自治区",
    "shortName": "广西",
    "level": "province",
    "longitude": 108.320004,
    "latitude": 22.82402,
    "bounds": {
      "minLatitude": 21.014934,
      "maxLatitude": 26.385778,
      "minLongitude": 104.489646,
      "maxLongitude": 112.05954
    }
  },
  {
    "id": "460000",
    "adcode": "460000",
    "name": "海南省",
    "shortName": "海南",
    "level": "province",
    "longitude": 110.33119,
    "latitude": 20.031971,
    "bounds": {
      "minLatitude": 3.823583,
      "maxLatitude": 20.163947,
      "minLongitude": 108.591186,
      "maxLongitude": 117.838899
    }
  },
  {
    "id": "500000",
    "adcode": "500000",
    "name": "重庆市",
    "shortName": "重庆",
    "level": "province",
    "longitude": 106.504962,
    "latitude": 29.533155,
    "bounds": {
      "minLatitude": 28.162837,
      "maxLatitude": 32.201266,
      "minLongitude": 105.296526,
      "maxLongitude": 110.200019
    }
  },
  {
    "id": "510000",
    "adcode": "510000",
    "name": "四川省",
    "shortName": "四川",
    "level": "province",
    "longitude": 104.065735,
    "latitude": 30.659462,
    "bounds": {
      "minLatitude": 26.04592,
      "maxLatitude": 34.312923,
      "minLongitude": 97.347829,
      "maxLongitude": 108.546838
    }
  },
  {
    "id": "520000",
    "adcode": "520000",
    "name": "贵州省",
    "shortName": "贵州",
    "level": "province",
    "longitude": 106.713478,
    "latitude": 26.578343,
    "bounds": {
      "minLatitude": 24.617953,
      "maxLatitude": 29.218037,
      "minLongitude": 103.601461,
      "maxLongitude": 109.597015
    }
  },
  {
    "id": "530000",
    "adcode": "530000",
    "name": "云南省",
    "shortName": "云南",
    "level": "province",
    "longitude": 102.712251,
    "latitude": 25.040609,
    "bounds": {
      "minLatitude": 21.14616,
      "maxLatitude": 29.221171,
      "minLongitude": 97.5283,
      "maxLongitude": 106.192718
    }
  },
  {
    "id": "540000",
    "adcode": "540000",
    "name": "西藏自治区",
    "shortName": "西藏",
    "level": "province",
    "longitude": 91.132212,
    "latitude": 29.660361,
    "bounds": {
      "minLatitude": 26.854991,
      "maxLatitude": 36.48208,
      "minLongitude": 78.395377,
      "maxLongitude": 99.114343
    }
  },
  {
    "id": "610000",
    "adcode": "610000",
    "name": "陕西省",
    "shortName": "陕西",
    "level": "province",
    "longitude": 108.948024,
    "latitude": 34.263161,
    "bounds": {
      "minLatitude": 31.705165,
      "maxLatitude": 39.587106,
      "minLongitude": 105.495475,
      "maxLongitude": 111.247732
    }
  },
  {
    "id": "620000",
    "adcode": "620000",
    "name": "甘肃省",
    "shortName": "甘肃",
    "level": "province",
    "longitude": 103.823557,
    "latitude": 36.058039,
    "bounds": {
      "minLatitude": 32.593893,
      "maxLatitude": 42.795257,
      "minLongitude": 92.339011,
      "maxLongitude": 108.712526
    }
  },
  {
    "id": "630000",
    "adcode": "630000",
    "name": "青海省",
    "shortName": "青海",
    "level": "province",
    "longitude": 101.778916,
    "latitude": 36.623178,
    "bounds": {
      "minLatitude": 31.598691,
      "maxLatitude": 39.208347,
      "minLongitude": 89.404676,
      "maxLongitude": 103.066826
    }
  },
  {
    "id": "640000",
    "adcode": "640000",
    "name": "宁夏回族自治区",
    "shortName": "宁夏",
    "level": "province",
    "longitude": 106.278179,
    "latitude": 38.46637,
    "bounds": {
      "minLatitude": 35.238532,
      "maxLatitude": 39.381564,
      "minLongitude": 104.287002,
      "maxLongitude": 107.659269
    }
  },
  {
    "id": "650000",
    "adcode": "650000",
    "name": "新疆维吾尔自治区",
    "shortName": "新疆",
    "level": "province",
    "longitude": 87.617733,
    "latitude": 43.792818,
    "bounds": {
      "minLatitude": 34.33467,
      "maxLatitude": 49.18249,
      "minLongitude": 73.502355,
      "maxLongitude": 96.386348
    }
  },
  {
    "id": "710000",
    "adcode": "710000",
    "name": "台湾省",
    "shortName": "台湾",
    "level": "province",
    "longitude": 121.509062,
    "latitude": 25.044332,
    "bounds": {
      "minLatitude": 21.883309,
      "maxLatitude": 25.941563,
      "minLongitude": 119.421247,
      "maxLongitude": 124.584666
    }
  },
  {
    "id": "810000",
    "adcode": "810000",
    "name": "香港特别行政区",
    "shortName": "香港",
    "level": "province",
    "longitude": 114.173355,
    "latitude": 22.320048,
    "bounds": {
      "minLatitude": 22.177888,
      "maxLatitude": 22.559201,
      "minLongitude": 113.8433,
      "maxLongitude": 114.406269
    }
  },
  {
    "id": "820000",
    "adcode": "820000",
    "name": "澳门特别行政区",
    "shortName": "澳门",
    "level": "province",
    "longitude": 113.54909,
    "latitude": 22.198951,
    "bounds": {
      "minLatitude": 22.107489,
      "maxLatitude": 22.212244,
      "minLongitude": 113.534715,
      "maxLongitude": 113.6037
    }
  }
];

const NATIONAL_SAMPLES: HenanCity[] = [
  {
    "id": "110000",
    "name": "北京市",
    "shortName": "北京",
    "latitude": 39.904989,
    "longitude": 116.405285
  },
  {
    "id": "120000",
    "name": "天津市",
    "shortName": "天津",
    "latitude": 39.125596,
    "longitude": 117.190182
  },
  {
    "id": "130000",
    "name": "河北省",
    "shortName": "河北",
    "latitude": 38.045474,
    "longitude": 114.502461
  },
  {
    "id": "140000",
    "name": "山西省",
    "shortName": "山西",
    "latitude": 37.857014,
    "longitude": 112.549248
  },
  {
    "id": "150000",
    "name": "内蒙古自治区",
    "shortName": "内蒙古",
    "latitude": 40.818311,
    "longitude": 111.670801
  },
  {
    "id": "210000",
    "name": "辽宁省",
    "shortName": "辽宁",
    "latitude": 41.796767,
    "longitude": 123.429096
  },
  {
    "id": "220000",
    "name": "吉林省",
    "shortName": "吉林",
    "latitude": 43.886841,
    "longitude": 125.3245
  },
  {
    "id": "230000",
    "name": "黑龙江省",
    "shortName": "黑龙江",
    "latitude": 45.756967,
    "longitude": 126.642464
  },
  {
    "id": "310000",
    "name": "上海市",
    "shortName": "上海",
    "latitude": 31.231706,
    "longitude": 121.472644
  },
  {
    "id": "320000",
    "name": "江苏省",
    "shortName": "江苏",
    "latitude": 32.041544,
    "longitude": 118.767413
  },
  {
    "id": "330000",
    "name": "浙江省",
    "shortName": "浙江",
    "latitude": 30.287459,
    "longitude": 120.153576
  },
  {
    "id": "340000",
    "name": "安徽省",
    "shortName": "安徽",
    "latitude": 31.86119,
    "longitude": 117.283042
  },
  {
    "id": "350000",
    "name": "福建省",
    "shortName": "福建",
    "latitude": 26.075302,
    "longitude": 119.306239
  },
  {
    "id": "360000",
    "name": "江西省",
    "shortName": "江西",
    "latitude": 28.676493,
    "longitude": 115.892151
  },
  {
    "id": "370000",
    "name": "山东省",
    "shortName": "山东",
    "latitude": 36.675807,
    "longitude": 117.000923
  },
  {
    "id": "410000",
    "name": "河南省",
    "shortName": "河南",
    "latitude": 34.757975,
    "longitude": 113.665412
  },
  {
    "id": "420000",
    "name": "湖北省",
    "shortName": "湖北",
    "latitude": 30.584355,
    "longitude": 114.298572
  },
  {
    "id": "430000",
    "name": "湖南省",
    "shortName": "湖南",
    "latitude": 28.19409,
    "longitude": 112.982279
  },
  {
    "id": "440000",
    "name": "广东省",
    "shortName": "广东",
    "latitude": 23.125178,
    "longitude": 113.280637
  },
  {
    "id": "450000",
    "name": "广西壮族自治区",
    "shortName": "广西",
    "latitude": 22.82402,
    "longitude": 108.320004
  },
  {
    "id": "460000",
    "name": "海南省",
    "shortName": "海南",
    "latitude": 20.031971,
    "longitude": 110.33119
  },
  {
    "id": "500000",
    "name": "重庆市",
    "shortName": "重庆",
    "latitude": 29.533155,
    "longitude": 106.504962
  },
  {
    "id": "510000",
    "name": "四川省",
    "shortName": "四川",
    "latitude": 30.659462,
    "longitude": 104.065735
  },
  {
    "id": "520000",
    "name": "贵州省",
    "shortName": "贵州",
    "latitude": 26.578343,
    "longitude": 106.713478
  },
  {
    "id": "530000",
    "name": "云南省",
    "shortName": "云南",
    "latitude": 25.040609,
    "longitude": 102.712251
  },
  {
    "id": "540000",
    "name": "西藏自治区",
    "shortName": "西藏",
    "latitude": 29.660361,
    "longitude": 91.132212
  },
  {
    "id": "610000",
    "name": "陕西省",
    "shortName": "陕西",
    "latitude": 34.263161,
    "longitude": 108.948024
  },
  {
    "id": "620000",
    "name": "甘肃省",
    "shortName": "甘肃",
    "latitude": 36.058039,
    "longitude": 103.823557
  },
  {
    "id": "630000",
    "name": "青海省",
    "shortName": "青海",
    "latitude": 36.623178,
    "longitude": 101.778916
  },
  {
    "id": "640000",
    "name": "宁夏回族自治区",
    "shortName": "宁夏",
    "latitude": 38.46637,
    "longitude": 106.278179
  },
  {
    "id": "650000",
    "name": "新疆维吾尔自治区",
    "shortName": "新疆",
    "latitude": 43.792818,
    "longitude": 87.617733
  },
  {
    "id": "710000",
    "name": "台湾省",
    "shortName": "台湾",
    "latitude": 25.044332,
    "longitude": 121.509062
  },
  {
    "id": "810000",
    "name": "香港特别行政区",
    "shortName": "香港",
    "latitude": 22.320048,
    "longitude": 114.173355
  },
  {
    "id": "820000",
    "name": "澳门特别行政区",
    "shortName": "澳门",
    "latitude": 22.198951,
    "longitude": 113.54909
  }
];

const PROVINCE_SAMPLES: Record<string, HenanCity[]> = {
  "110000": [
    {
      "id": "110000-110101",
      "name": "东城区",
      "shortName": "东城区",
      "longitude": 116.418757,
      "latitude": 39.917544
    },
    {
      "id": "110000-110102",
      "name": "西城区",
      "shortName": "西城区",
      "longitude": 116.366794,
      "latitude": 39.915309
    },
    {
      "id": "110000-110105",
      "name": "朝阳区",
      "shortName": "朝阳区",
      "longitude": 116.486409,
      "latitude": 39.921489
    },
    {
      "id": "110000-110106",
      "name": "丰台区",
      "shortName": "丰台区",
      "longitude": 116.286968,
      "latitude": 39.863642
    },
    {
      "id": "110000-110107",
      "name": "石景山区",
      "shortName": "石景山区",
      "longitude": 116.195445,
      "latitude": 39.914601
    },
    {
      "id": "110000-110108",
      "name": "海淀区",
      "shortName": "海淀区",
      "longitude": 116.310316,
      "latitude": 39.956074
    },
    {
      "id": "110000-110109",
      "name": "门头沟区",
      "shortName": "门头沟区",
      "longitude": 116.105381,
      "latitude": 39.937183
    },
    {
      "id": "110000-110111",
      "name": "房山区",
      "shortName": "房山区",
      "longitude": 116.139157,
      "latitude": 39.735535
    },
    {
      "id": "110000-110112",
      "name": "通州区",
      "shortName": "通州区",
      "longitude": 116.658603,
      "latitude": 39.902486
    },
    {
      "id": "110000-110113",
      "name": "顺义区",
      "shortName": "顺义区",
      "longitude": 116.653525,
      "latitude": 40.128936
    },
    {
      "id": "110000-110114",
      "name": "昌平区",
      "shortName": "昌平区",
      "longitude": 116.235906,
      "latitude": 40.218085
    },
    {
      "id": "110000-110115",
      "name": "大兴区",
      "shortName": "大兴区",
      "longitude": 116.338033,
      "latitude": 39.728908
    },
    {
      "id": "110000-110116",
      "name": "怀柔区",
      "shortName": "怀柔区",
      "longitude": 116.637122,
      "latitude": 40.324272
    },
    {
      "id": "110000-110117",
      "name": "平谷区",
      "shortName": "平谷区",
      "longitude": 117.112335,
      "latitude": 40.144783
    },
    {
      "id": "110000-110118",
      "name": "密云区",
      "shortName": "密云区",
      "longitude": 116.843352,
      "latitude": 40.377362
    },
    {
      "id": "110000-110119",
      "name": "延庆区",
      "shortName": "延庆区",
      "longitude": 115.985006,
      "latitude": 40.465325
    }
  ],
  "120000": [
    {
      "id": "120000-120101",
      "name": "和平区",
      "shortName": "和平区",
      "longitude": 117.195907,
      "latitude": 39.118327
    },
    {
      "id": "120000-120102",
      "name": "河东区",
      "shortName": "河东区",
      "longitude": 117.226568,
      "latitude": 39.122125
    },
    {
      "id": "120000-120103",
      "name": "河西区",
      "shortName": "河西区",
      "longitude": 117.217536,
      "latitude": 39.101897
    },
    {
      "id": "120000-120104",
      "name": "南开区",
      "shortName": "南开区",
      "longitude": 117.164143,
      "latitude": 39.120474
    },
    {
      "id": "120000-120105",
      "name": "河北区",
      "shortName": "河北区",
      "longitude": 117.201569,
      "latitude": 39.156632
    },
    {
      "id": "120000-120106",
      "name": "红桥区",
      "shortName": "红桥区",
      "longitude": 117.163301,
      "latitude": 39.175066
    },
    {
      "id": "120000-120110",
      "name": "东丽区",
      "shortName": "东丽区",
      "longitude": 117.313967,
      "latitude": 39.087764
    },
    {
      "id": "120000-120111",
      "name": "西青区",
      "shortName": "西青区",
      "longitude": 117.012247,
      "latitude": 39.139446
    },
    {
      "id": "120000-120112",
      "name": "津南区",
      "shortName": "津南区",
      "longitude": 117.382549,
      "latitude": 38.989577
    },
    {
      "id": "120000-120113",
      "name": "北辰区",
      "shortName": "北辰区",
      "longitude": 117.13482,
      "latitude": 39.225555
    },
    {
      "id": "120000-120114",
      "name": "武清区",
      "shortName": "武清区",
      "longitude": 117.057959,
      "latitude": 39.376925
    },
    {
      "id": "120000-120115",
      "name": "宝坻区",
      "shortName": "宝坻区",
      "longitude": 117.308094,
      "latitude": 39.716965
    },
    {
      "id": "120000-120116",
      "name": "滨海新区",
      "shortName": "滨海新区",
      "longitude": 117.654173,
      "latitude": 39.032846
    },
    {
      "id": "120000-120117",
      "name": "宁河区",
      "shortName": "宁河区",
      "longitude": 117.82828,
      "latitude": 39.328886
    },
    {
      "id": "120000-120118",
      "name": "静海区",
      "shortName": "静海区",
      "longitude": 116.925304,
      "latitude": 38.935671
    },
    {
      "id": "120000-120119",
      "name": "蓟州区",
      "shortName": "蓟州区",
      "longitude": 117.407449,
      "latitude": 40.045342
    }
  ],
  "130000": [
    {
      "id": "130000-130100",
      "name": "石家庄市",
      "shortName": "石家庄",
      "longitude": 114.502461,
      "latitude": 38.045474
    },
    {
      "id": "130000-130200",
      "name": "唐山市",
      "shortName": "唐山",
      "longitude": 118.175393,
      "latitude": 39.635113
    },
    {
      "id": "130000-130300",
      "name": "秦皇岛市",
      "shortName": "秦皇岛",
      "longitude": 119.586579,
      "latitude": 39.942531
    },
    {
      "id": "130000-130400",
      "name": "邯郸市",
      "shortName": "邯郸",
      "longitude": 114.490686,
      "latitude": 36.612273
    },
    {
      "id": "130000-130500",
      "name": "邢台市",
      "shortName": "邢台",
      "longitude": 114.508851,
      "latitude": 37.0682
    },
    {
      "id": "130000-130600",
      "name": "保定市",
      "shortName": "保定",
      "longitude": 115.482331,
      "latitude": 38.867657
    },
    {
      "id": "130000-130700",
      "name": "张家口市",
      "shortName": "张家口",
      "longitude": 114.884091,
      "latitude": 40.811901
    },
    {
      "id": "130000-130800",
      "name": "承德市",
      "shortName": "承德",
      "longitude": 117.939152,
      "latitude": 40.976204
    },
    {
      "id": "130000-130900",
      "name": "沧州市",
      "shortName": "沧州",
      "longitude": 116.857461,
      "latitude": 38.310582
    },
    {
      "id": "130000-131000",
      "name": "廊坊市",
      "shortName": "廊坊",
      "longitude": 116.704441,
      "latitude": 39.523927
    },
    {
      "id": "130000-131100",
      "name": "衡水市",
      "shortName": "衡水",
      "longitude": 115.665993,
      "latitude": 37.735097
    }
  ],
  "140000": [
    {
      "id": "140000-140100",
      "name": "太原市",
      "shortName": "太原",
      "longitude": 112.549248,
      "latitude": 37.857014
    },
    {
      "id": "140000-140200",
      "name": "大同市",
      "shortName": "大同",
      "longitude": 113.295259,
      "latitude": 40.09031
    },
    {
      "id": "140000-140300",
      "name": "阳泉市",
      "shortName": "阳泉",
      "longitude": 113.583285,
      "latitude": 37.861188
    },
    {
      "id": "140000-140400",
      "name": "长治市",
      "shortName": "长治",
      "longitude": 113.113556,
      "latitude": 36.191112
    },
    {
      "id": "140000-140500",
      "name": "晋城市",
      "shortName": "晋城",
      "longitude": 112.851274,
      "latitude": 35.497553
    },
    {
      "id": "140000-140600",
      "name": "朔州市",
      "shortName": "朔州",
      "longitude": 112.433387,
      "latitude": 39.331261
    },
    {
      "id": "140000-140700",
      "name": "晋中市",
      "shortName": "晋中",
      "longitude": 112.736465,
      "latitude": 37.696495
    },
    {
      "id": "140000-140800",
      "name": "运城市",
      "shortName": "运城",
      "longitude": 111.003957,
      "latitude": 35.022778
    },
    {
      "id": "140000-140900",
      "name": "忻州市",
      "shortName": "忻州",
      "longitude": 112.733538,
      "latitude": 38.41769
    },
    {
      "id": "140000-141000",
      "name": "临汾市",
      "shortName": "临汾",
      "longitude": 111.517973,
      "latitude": 36.08415
    },
    {
      "id": "140000-141100",
      "name": "吕梁市",
      "shortName": "吕梁",
      "longitude": 111.134335,
      "latitude": 37.524366
    }
  ],
  "150000": [
    {
      "id": "150000-150100",
      "name": "呼和浩特市",
      "shortName": "呼和浩特",
      "longitude": 111.670801,
      "latitude": 40.818311
    },
    {
      "id": "150000-150200",
      "name": "包头市",
      "shortName": "包头",
      "longitude": 109.840405,
      "latitude": 40.658168
    },
    {
      "id": "150000-150300",
      "name": "乌海市",
      "shortName": "乌海",
      "longitude": 106.825563,
      "latitude": 39.673734
    },
    {
      "id": "150000-150400",
      "name": "赤峰市",
      "shortName": "赤峰",
      "longitude": 118.956806,
      "latitude": 42.275317
    },
    {
      "id": "150000-150500",
      "name": "通辽市",
      "shortName": "通辽",
      "longitude": 122.263119,
      "latitude": 43.617429
    },
    {
      "id": "150000-150600",
      "name": "鄂尔多斯市",
      "shortName": "鄂尔多斯",
      "longitude": 109.99029,
      "latitude": 39.817179
    },
    {
      "id": "150000-150700",
      "name": "呼伦贝尔市",
      "shortName": "呼伦贝尔",
      "longitude": 119.758168,
      "latitude": 49.215333
    },
    {
      "id": "150000-150800",
      "name": "巴彦淖尔市",
      "shortName": "巴彦淖尔",
      "longitude": 107.416959,
      "latitude": 40.757402
    },
    {
      "id": "150000-150900",
      "name": "乌兰察布市",
      "shortName": "乌兰察布",
      "longitude": 113.114543,
      "latitude": 41.034126
    },
    {
      "id": "150000-152200",
      "name": "兴安盟",
      "shortName": "兴安盟",
      "longitude": 122.070317,
      "latitude": 46.076268
    },
    {
      "id": "150000-152500",
      "name": "锡林郭勒盟",
      "shortName": "锡林郭勒盟",
      "longitude": 116.090996,
      "latitude": 43.944018
    },
    {
      "id": "150000-152900",
      "name": "阿拉善盟",
      "shortName": "阿拉善盟",
      "longitude": 105.706422,
      "latitude": 38.844814
    }
  ],
  "210000": [
    {
      "id": "210000-210100",
      "name": "沈阳市",
      "shortName": "沈阳",
      "longitude": 123.429096,
      "latitude": 41.796767
    },
    {
      "id": "210000-210200",
      "name": "大连市",
      "shortName": "大连",
      "longitude": 121.618622,
      "latitude": 38.91459
    },
    {
      "id": "210000-210300",
      "name": "鞍山市",
      "shortName": "鞍山",
      "longitude": 122.995632,
      "latitude": 41.110626
    },
    {
      "id": "210000-210400",
      "name": "抚顺市",
      "shortName": "抚顺",
      "longitude": 123.921109,
      "latitude": 41.875956
    },
    {
      "id": "210000-210500",
      "name": "本溪市",
      "shortName": "本溪",
      "longitude": 123.770519,
      "latitude": 41.297909
    },
    {
      "id": "210000-210600",
      "name": "丹东市",
      "shortName": "丹东",
      "longitude": 124.383044,
      "latitude": 40.124296
    },
    {
      "id": "210000-210700",
      "name": "锦州市",
      "shortName": "锦州",
      "longitude": 121.135742,
      "latitude": 41.119269
    },
    {
      "id": "210000-210800",
      "name": "营口市",
      "shortName": "营口",
      "longitude": 122.235151,
      "latitude": 40.667432
    },
    {
      "id": "210000-210900",
      "name": "阜新市",
      "shortName": "阜新",
      "longitude": 121.648962,
      "latitude": 42.011796
    },
    {
      "id": "210000-211000",
      "name": "辽阳市",
      "shortName": "辽阳",
      "longitude": 123.18152,
      "latitude": 41.269402
    },
    {
      "id": "210000-211100",
      "name": "盘锦市",
      "shortName": "盘锦",
      "longitude": 122.06957,
      "latitude": 41.124484
    },
    {
      "id": "210000-211200",
      "name": "铁岭市",
      "shortName": "铁岭",
      "longitude": 123.844279,
      "latitude": 42.290585
    },
    {
      "id": "210000-211300",
      "name": "朝阳市",
      "shortName": "朝阳",
      "longitude": 120.451176,
      "latitude": 41.576758
    },
    {
      "id": "210000-211400",
      "name": "葫芦岛市",
      "shortName": "葫芦岛",
      "longitude": 120.856394,
      "latitude": 40.755572
    }
  ],
  "220000": [
    {
      "id": "220000-220100",
      "name": "长春市",
      "shortName": "长春",
      "longitude": 125.3245,
      "latitude": 43.886841
    },
    {
      "id": "220000-220200",
      "name": "吉林市",
      "shortName": "吉林",
      "longitude": 126.55302,
      "latitude": 43.843577
    },
    {
      "id": "220000-220300",
      "name": "四平市",
      "shortName": "四平",
      "longitude": 124.370785,
      "latitude": 43.170344
    },
    {
      "id": "220000-220400",
      "name": "辽源市",
      "shortName": "辽源",
      "longitude": 125.145349,
      "latitude": 42.902692
    },
    {
      "id": "220000-220500",
      "name": "通化市",
      "shortName": "通化",
      "longitude": 125.936501,
      "latitude": 41.721177
    },
    {
      "id": "220000-220600",
      "name": "白山市",
      "shortName": "白山",
      "longitude": 126.427839,
      "latitude": 41.942505
    },
    {
      "id": "220000-220700",
      "name": "松原市",
      "shortName": "松原",
      "longitude": 124.823608,
      "latitude": 45.118243
    },
    {
      "id": "220000-220800",
      "name": "白城市",
      "shortName": "白城",
      "longitude": 122.841114,
      "latitude": 45.619026
    },
    {
      "id": "220000-222400",
      "name": "延边朝鲜族自治州",
      "shortName": "延边朝鲜族自治州",
      "longitude": 129.513228,
      "latitude": 42.904823
    }
  ],
  "230000": [
    {
      "id": "230000-230100",
      "name": "哈尔滨市",
      "shortName": "哈尔滨",
      "longitude": 126.642464,
      "latitude": 45.756967
    },
    {
      "id": "230000-230200",
      "name": "齐齐哈尔市",
      "shortName": "齐齐哈尔",
      "longitude": 123.95792,
      "latitude": 47.342081
    },
    {
      "id": "230000-230300",
      "name": "鸡西市",
      "shortName": "鸡西",
      "longitude": 130.975966,
      "latitude": 45.300046
    },
    {
      "id": "230000-230400",
      "name": "鹤岗市",
      "shortName": "鹤岗",
      "longitude": 130.277487,
      "latitude": 47.332085
    },
    {
      "id": "230000-230500",
      "name": "双鸭山市",
      "shortName": "双鸭山",
      "longitude": 131.157304,
      "latitude": 46.643442
    },
    {
      "id": "230000-230600",
      "name": "大庆市",
      "shortName": "大庆",
      "longitude": 125.11272,
      "latitude": 46.590734
    },
    {
      "id": "230000-230700",
      "name": "伊春市",
      "shortName": "伊春",
      "longitude": 128.899396,
      "latitude": 47.724775
    },
    {
      "id": "230000-230800",
      "name": "佳木斯市",
      "shortName": "佳木斯",
      "longitude": 130.361634,
      "latitude": 46.809606
    },
    {
      "id": "230000-230900",
      "name": "七台河市",
      "shortName": "七台河",
      "longitude": 131.015584,
      "latitude": 45.771266
    },
    {
      "id": "230000-231000",
      "name": "牡丹江市",
      "shortName": "牡丹江",
      "longitude": 129.618602,
      "latitude": 44.582962
    },
    {
      "id": "230000-231100",
      "name": "黑河市",
      "shortName": "黑河",
      "longitude": 127.499023,
      "latitude": 50.249585
    },
    {
      "id": "230000-231200",
      "name": "绥化市",
      "shortName": "绥化",
      "longitude": 126.99293,
      "latitude": 46.637393
    },
    {
      "id": "230000-232700",
      "name": "大兴安岭地区",
      "shortName": "大兴安岭地区",
      "longitude": 124.711526,
      "latitude": 52.335262
    }
  ],
  "310000": [
    {
      "id": "310000-310101",
      "name": "黄浦区",
      "shortName": "黄浦区",
      "longitude": 121.490317,
      "latitude": 31.222771
    },
    {
      "id": "310000-310104",
      "name": "徐汇区",
      "shortName": "徐汇区",
      "longitude": 121.43752,
      "latitude": 31.179973
    },
    {
      "id": "310000-310105",
      "name": "长宁区",
      "shortName": "长宁区",
      "longitude": 121.4222,
      "latitude": 31.218123
    },
    {
      "id": "310000-310106",
      "name": "静安区",
      "shortName": "静安区",
      "longitude": 121.448224,
      "latitude": 31.229003
    },
    {
      "id": "310000-310107",
      "name": "普陀区",
      "shortName": "普陀区",
      "longitude": 121.392499,
      "latitude": 31.241701
    },
    {
      "id": "310000-310109",
      "name": "虹口区",
      "shortName": "虹口区",
      "longitude": 121.491832,
      "latitude": 31.26097
    },
    {
      "id": "310000-310110",
      "name": "杨浦区",
      "shortName": "杨浦区",
      "longitude": 121.522797,
      "latitude": 31.270755
    },
    {
      "id": "310000-310112",
      "name": "闵行区",
      "shortName": "闵行区",
      "longitude": 121.375972,
      "latitude": 31.111658
    },
    {
      "id": "310000-310113",
      "name": "宝山区",
      "shortName": "宝山区",
      "longitude": 121.489934,
      "latitude": 31.398896
    },
    {
      "id": "310000-310114",
      "name": "嘉定区",
      "shortName": "嘉定区",
      "longitude": 121.250333,
      "latitude": 31.383524
    },
    {
      "id": "310000-310115",
      "name": "浦东新区",
      "shortName": "浦东新区",
      "longitude": 121.567706,
      "latitude": 31.245944
    },
    {
      "id": "310000-310116",
      "name": "金山区",
      "shortName": "金山区",
      "longitude": 121.330736,
      "latitude": 30.724697
    },
    {
      "id": "310000-310117",
      "name": "松江区",
      "shortName": "松江区",
      "longitude": 121.223543,
      "latitude": 31.03047
    },
    {
      "id": "310000-310118",
      "name": "青浦区",
      "shortName": "青浦区",
      "longitude": 121.113021,
      "latitude": 31.151209
    },
    {
      "id": "310000-310120",
      "name": "奉贤区",
      "shortName": "奉贤区",
      "longitude": 121.458472,
      "latitude": 30.912345
    },
    {
      "id": "310000-310151",
      "name": "崇明区",
      "shortName": "崇明区",
      "longitude": 121.397516,
      "latitude": 31.626946
    }
  ],
  "320000": [
    {
      "id": "320000-320100",
      "name": "南京市",
      "shortName": "南京",
      "longitude": 118.767413,
      "latitude": 32.041544
    },
    {
      "id": "320000-320200",
      "name": "无锡市",
      "shortName": "无锡",
      "longitude": 120.301663,
      "latitude": 31.574729
    },
    {
      "id": "320000-320300",
      "name": "徐州市",
      "shortName": "徐州",
      "longitude": 117.184811,
      "latitude": 34.261792
    },
    {
      "id": "320000-320400",
      "name": "常州市",
      "shortName": "常州",
      "longitude": 119.946973,
      "latitude": 31.772752
    },
    {
      "id": "320000-320500",
      "name": "苏州市",
      "shortName": "苏州",
      "longitude": 120.619585,
      "latitude": 31.299379
    },
    {
      "id": "320000-320600",
      "name": "南通市",
      "shortName": "南通",
      "longitude": 120.864608,
      "latitude": 32.016212
    },
    {
      "id": "320000-320700",
      "name": "连云港市",
      "shortName": "连云港",
      "longitude": 119.178821,
      "latitude": 34.600018
    },
    {
      "id": "320000-320800",
      "name": "淮安市",
      "shortName": "淮安",
      "longitude": 119.021265,
      "latitude": 33.597506
    },
    {
      "id": "320000-320900",
      "name": "盐城市",
      "shortName": "盐城",
      "longitude": 120.139998,
      "latitude": 33.377631
    },
    {
      "id": "320000-321000",
      "name": "扬州市",
      "shortName": "扬州",
      "longitude": 119.421003,
      "latitude": 32.393159
    },
    {
      "id": "320000-321100",
      "name": "镇江市",
      "shortName": "镇江",
      "longitude": 119.452753,
      "latitude": 32.204402
    },
    {
      "id": "320000-321200",
      "name": "泰州市",
      "shortName": "泰州",
      "longitude": 119.915176,
      "latitude": 32.484882
    },
    {
      "id": "320000-321300",
      "name": "宿迁市",
      "shortName": "宿迁",
      "longitude": 118.275162,
      "latitude": 33.963008
    }
  ],
  "330000": [
    {
      "id": "330000-330100",
      "name": "杭州市",
      "shortName": "杭州",
      "longitude": 120.153576,
      "latitude": 30.287459
    },
    {
      "id": "330000-330200",
      "name": "宁波市",
      "shortName": "宁波",
      "longitude": 121.549792,
      "latitude": 29.868388
    },
    {
      "id": "330000-330300",
      "name": "温州市",
      "shortName": "温州",
      "longitude": 120.672111,
      "latitude": 28.000575
    },
    {
      "id": "330000-330400",
      "name": "嘉兴市",
      "shortName": "嘉兴",
      "longitude": 120.750865,
      "latitude": 30.762653
    },
    {
      "id": "330000-330500",
      "name": "湖州市",
      "shortName": "湖州",
      "longitude": 120.102398,
      "latitude": 30.867198
    },
    {
      "id": "330000-330600",
      "name": "绍兴市",
      "shortName": "绍兴",
      "longitude": 120.582112,
      "latitude": 29.997117
    },
    {
      "id": "330000-330700",
      "name": "金华市",
      "shortName": "金华",
      "longitude": 119.649506,
      "latitude": 29.089524
    },
    {
      "id": "330000-330800",
      "name": "衢州市",
      "shortName": "衢州",
      "longitude": 118.87263,
      "latitude": 28.941708
    },
    {
      "id": "330000-330900",
      "name": "舟山市",
      "shortName": "舟山",
      "longitude": 122.106863,
      "latitude": 30.016028
    },
    {
      "id": "330000-331000",
      "name": "台州市",
      "shortName": "台州",
      "longitude": 121.428599,
      "latitude": 28.661378
    },
    {
      "id": "330000-331100",
      "name": "丽水市",
      "shortName": "丽水",
      "longitude": 119.921786,
      "latitude": 28.451993
    }
  ],
  "340000": [
    {
      "id": "340000-340100",
      "name": "合肥市",
      "shortName": "合肥",
      "longitude": 117.283042,
      "latitude": 31.86119
    },
    {
      "id": "340000-340200",
      "name": "芜湖市",
      "shortName": "芜湖",
      "longitude": 118.376451,
      "latitude": 31.326319
    },
    {
      "id": "340000-340300",
      "name": "蚌埠市",
      "shortName": "蚌埠",
      "longitude": 117.363228,
      "latitude": 32.939667
    },
    {
      "id": "340000-340400",
      "name": "淮南市",
      "shortName": "淮南",
      "longitude": 117.018329,
      "latitude": 32.647574
    },
    {
      "id": "340000-340500",
      "name": "马鞍山市",
      "shortName": "马鞍山",
      "longitude": 118.507906,
      "latitude": 31.689362
    },
    {
      "id": "340000-340600",
      "name": "淮北市",
      "shortName": "淮北",
      "longitude": 116.794664,
      "latitude": 33.971707
    },
    {
      "id": "340000-340700",
      "name": "铜陵市",
      "shortName": "铜陵",
      "longitude": 117.816576,
      "latitude": 30.929935
    },
    {
      "id": "340000-340800",
      "name": "安庆市",
      "shortName": "安庆",
      "longitude": 117.043551,
      "latitude": 30.50883
    },
    {
      "id": "340000-341000",
      "name": "黄山市",
      "shortName": "黄山",
      "longitude": 118.317325,
      "latitude": 29.709239
    },
    {
      "id": "340000-341100",
      "name": "滁州市",
      "shortName": "滁州",
      "longitude": 118.316264,
      "latitude": 32.303627
    },
    {
      "id": "340000-341200",
      "name": "阜阳市",
      "shortName": "阜阳",
      "longitude": 115.819729,
      "latitude": 32.896969
    },
    {
      "id": "340000-341300",
      "name": "宿州市",
      "shortName": "宿州",
      "longitude": 116.984084,
      "latitude": 33.633891
    },
    {
      "id": "340000-341500",
      "name": "六安市",
      "shortName": "六安",
      "longitude": 116.507676,
      "latitude": 31.752889
    },
    {
      "id": "340000-341600",
      "name": "亳州市",
      "shortName": "亳州",
      "longitude": 115.782939,
      "latitude": 33.869338
    },
    {
      "id": "340000-341700",
      "name": "池州市",
      "shortName": "池州",
      "longitude": 117.489157,
      "latitude": 30.656037
    },
    {
      "id": "340000-341800",
      "name": "宣城市",
      "shortName": "宣城",
      "longitude": 118.757995,
      "latitude": 30.945667
    }
  ],
  "350000": [
    {
      "id": "350000-350100",
      "name": "福州市",
      "shortName": "福州",
      "longitude": 119.306239,
      "latitude": 26.075302
    },
    {
      "id": "350000-350200",
      "name": "厦门市",
      "shortName": "厦门",
      "longitude": 118.11022,
      "latitude": 24.490474
    },
    {
      "id": "350000-350300",
      "name": "莆田市",
      "shortName": "莆田",
      "longitude": 119.007558,
      "latitude": 25.431011
    },
    {
      "id": "350000-350400",
      "name": "三明市",
      "shortName": "三明",
      "longitude": 117.635001,
      "latitude": 26.265444
    },
    {
      "id": "350000-350500",
      "name": "泉州市",
      "shortName": "泉州",
      "longitude": 118.589421,
      "latitude": 24.908853
    },
    {
      "id": "350000-350600",
      "name": "漳州市",
      "shortName": "漳州",
      "longitude": 117.661801,
      "latitude": 24.510897
    },
    {
      "id": "350000-350700",
      "name": "南平市",
      "shortName": "南平",
      "longitude": 118.178459,
      "latitude": 26.635627
    },
    {
      "id": "350000-350800",
      "name": "龙岩市",
      "shortName": "龙岩",
      "longitude": 117.02978,
      "latitude": 25.091603
    },
    {
      "id": "350000-350900",
      "name": "宁德市",
      "shortName": "宁德",
      "longitude": 119.527082,
      "latitude": 26.65924
    }
  ],
  "360000": [
    {
      "id": "360000-360100",
      "name": "南昌市",
      "shortName": "南昌",
      "longitude": 115.892151,
      "latitude": 28.676493
    },
    {
      "id": "360000-360200",
      "name": "景德镇市",
      "shortName": "景德镇",
      "longitude": 117.214664,
      "latitude": 29.29256
    },
    {
      "id": "360000-360300",
      "name": "萍乡市",
      "shortName": "萍乡",
      "longitude": 113.852186,
      "latitude": 27.622946
    },
    {
      "id": "360000-360400",
      "name": "九江市",
      "shortName": "九江",
      "longitude": 115.992811,
      "latitude": 29.712034
    },
    {
      "id": "360000-360500",
      "name": "新余市",
      "shortName": "新余",
      "longitude": 114.930835,
      "latitude": 27.810834
    },
    {
      "id": "360000-360600",
      "name": "鹰潭市",
      "shortName": "鹰潭",
      "longitude": 117.033838,
      "latitude": 28.238638
    },
    {
      "id": "360000-360700",
      "name": "赣州市",
      "shortName": "赣州",
      "longitude": 114.940278,
      "latitude": 25.85097
    },
    {
      "id": "360000-360800",
      "name": "吉安市",
      "shortName": "吉安",
      "longitude": 114.986373,
      "latitude": 27.111699
    },
    {
      "id": "360000-360900",
      "name": "宜春市",
      "shortName": "宜春",
      "longitude": 114.391136,
      "latitude": 27.8043
    },
    {
      "id": "360000-361000",
      "name": "抚州市",
      "shortName": "抚州",
      "longitude": 116.358351,
      "latitude": 27.98385
    },
    {
      "id": "360000-361100",
      "name": "上饶市",
      "shortName": "上饶",
      "longitude": 117.971185,
      "latitude": 28.44442
    }
  ],
  "370000": [
    {
      "id": "370000-370100",
      "name": "济南市",
      "shortName": "济南",
      "longitude": 117.000923,
      "latitude": 36.675807
    },
    {
      "id": "370000-370200",
      "name": "青岛市",
      "shortName": "青岛",
      "longitude": 120.355173,
      "latitude": 36.082982
    },
    {
      "id": "370000-370300",
      "name": "淄博市",
      "shortName": "淄博",
      "longitude": 118.047648,
      "latitude": 36.814939
    },
    {
      "id": "370000-370400",
      "name": "枣庄市",
      "shortName": "枣庄",
      "longitude": 117.557964,
      "latitude": 34.856424
    },
    {
      "id": "370000-370500",
      "name": "东营市",
      "shortName": "东营",
      "longitude": 118.66471,
      "latitude": 37.434564
    },
    {
      "id": "370000-370600",
      "name": "烟台市",
      "shortName": "烟台",
      "longitude": 121.391382,
      "latitude": 37.539297
    },
    {
      "id": "370000-370700",
      "name": "潍坊市",
      "shortName": "潍坊",
      "longitude": 119.107078,
      "latitude": 36.70925
    },
    {
      "id": "370000-370800",
      "name": "济宁市",
      "shortName": "济宁",
      "longitude": 116.587245,
      "latitude": 35.415393
    },
    {
      "id": "370000-370900",
      "name": "泰安市",
      "shortName": "泰安",
      "longitude": 117.129063,
      "latitude": 36.194968
    },
    {
      "id": "370000-371000",
      "name": "威海市",
      "shortName": "威海",
      "longitude": 122.116394,
      "latitude": 37.509691
    },
    {
      "id": "370000-371100",
      "name": "日照市",
      "shortName": "日照",
      "longitude": 119.461208,
      "latitude": 35.428588
    },
    {
      "id": "370000-371300",
      "name": "临沂市",
      "shortName": "临沂",
      "longitude": 118.326443,
      "latitude": 35.065282
    },
    {
      "id": "370000-371400",
      "name": "德州市",
      "shortName": "德州",
      "longitude": 116.307428,
      "latitude": 37.453968
    },
    {
      "id": "370000-371500",
      "name": "聊城市",
      "shortName": "聊城",
      "longitude": 115.980367,
      "latitude": 36.456013
    },
    {
      "id": "370000-371600",
      "name": "滨州市",
      "shortName": "滨州",
      "longitude": 118.016974,
      "latitude": 37.383542
    },
    {
      "id": "370000-371700",
      "name": "菏泽市",
      "shortName": "菏泽",
      "longitude": 115.469381,
      "latitude": 35.246531
    }
  ],
  "410000": [
    {
      "id": "410000-410100",
      "name": "郑州市",
      "shortName": "郑州",
      "longitude": 113.665412,
      "latitude": 34.757975
    },
    {
      "id": "410000-410200",
      "name": "开封市",
      "shortName": "开封",
      "longitude": 114.341447,
      "latitude": 34.797049
    },
    {
      "id": "410000-410300",
      "name": "洛阳市",
      "shortName": "洛阳",
      "longitude": 112.434468,
      "latitude": 34.663041
    },
    {
      "id": "410000-410400",
      "name": "平顶山市",
      "shortName": "平顶山",
      "longitude": 113.307718,
      "latitude": 33.735241
    },
    {
      "id": "410000-410500",
      "name": "安阳市",
      "shortName": "安阳",
      "longitude": 114.352482,
      "latitude": 36.103442
    },
    {
      "id": "410000-410600",
      "name": "鹤壁市",
      "shortName": "鹤壁",
      "longitude": 114.295444,
      "latitude": 35.748236
    },
    {
      "id": "410000-410700",
      "name": "新乡市",
      "shortName": "新乡",
      "longitude": 113.883991,
      "latitude": 35.302616
    },
    {
      "id": "410000-410800",
      "name": "焦作市",
      "shortName": "焦作",
      "longitude": 113.238266,
      "latitude": 35.23904
    },
    {
      "id": "410000-410900",
      "name": "濮阳市",
      "shortName": "濮阳",
      "longitude": 115.041299,
      "latitude": 35.768234
    },
    {
      "id": "410000-411000",
      "name": "许昌市",
      "shortName": "许昌",
      "longitude": 113.826063,
      "latitude": 34.022956
    },
    {
      "id": "410000-411100",
      "name": "漯河市",
      "shortName": "漯河",
      "longitude": 114.026405,
      "latitude": 33.575855
    },
    {
      "id": "410000-411200",
      "name": "三门峡市",
      "shortName": "三门峡",
      "longitude": 111.194099,
      "latitude": 34.777338
    },
    {
      "id": "410000-411300",
      "name": "南阳市",
      "shortName": "南阳",
      "longitude": 112.540918,
      "latitude": 32.999082
    },
    {
      "id": "410000-411400",
      "name": "商丘市",
      "shortName": "商丘",
      "longitude": 115.650497,
      "latitude": 34.437054
    },
    {
      "id": "410000-411500",
      "name": "信阳市",
      "shortName": "信阳",
      "longitude": 114.075031,
      "latitude": 32.123274
    },
    {
      "id": "410000-411600",
      "name": "周口市",
      "shortName": "周口",
      "longitude": 114.649653,
      "latitude": 33.620357
    },
    {
      "id": "410000-411700",
      "name": "驻马店市",
      "shortName": "驻马店",
      "longitude": 114.024736,
      "latitude": 32.980169
    },
    {
      "id": "410000-419001",
      "name": "济源市",
      "shortName": "济源",
      "longitude": 112.590047,
      "latitude": 35.090378
    }
  ],
  "420000": [
    {
      "id": "420000-420100",
      "name": "武汉市",
      "shortName": "武汉",
      "longitude": 114.298572,
      "latitude": 30.584355
    },
    {
      "id": "420000-420200",
      "name": "黄石市",
      "shortName": "黄石",
      "longitude": 115.077048,
      "latitude": 30.220074
    },
    {
      "id": "420000-420300",
      "name": "十堰市",
      "shortName": "十堰",
      "longitude": 110.787916,
      "latitude": 32.646907
    },
    {
      "id": "420000-420500",
      "name": "宜昌市",
      "shortName": "宜昌",
      "longitude": 111.290843,
      "latitude": 30.702636
    },
    {
      "id": "420000-420600",
      "name": "襄阳市",
      "shortName": "襄阳",
      "longitude": 112.144146,
      "latitude": 32.042426
    },
    {
      "id": "420000-420700",
      "name": "鄂州市",
      "shortName": "鄂州",
      "longitude": 114.890593,
      "latitude": 30.396536
    },
    {
      "id": "420000-420800",
      "name": "荆门市",
      "shortName": "荆门",
      "longitude": 112.204251,
      "latitude": 31.03542
    },
    {
      "id": "420000-420900",
      "name": "孝感市",
      "shortName": "孝感",
      "longitude": 113.926655,
      "latitude": 30.926423
    },
    {
      "id": "420000-421000",
      "name": "荆州市",
      "shortName": "荆州",
      "longitude": 112.23813,
      "latitude": 30.326857
    },
    {
      "id": "420000-421100",
      "name": "黄冈市",
      "shortName": "黄冈",
      "longitude": 114.879365,
      "latitude": 30.447711
    },
    {
      "id": "420000-421200",
      "name": "咸宁市",
      "shortName": "咸宁",
      "longitude": 114.328963,
      "latitude": 29.832798
    },
    {
      "id": "420000-421300",
      "name": "随州市",
      "shortName": "随州",
      "longitude": 113.37377,
      "latitude": 31.717497
    },
    {
      "id": "420000-422800",
      "name": "恩施土家族苗族自治州",
      "shortName": "恩施土家族苗族自治州",
      "longitude": 109.48699,
      "latitude": 30.283114
    },
    {
      "id": "420000-429004",
      "name": "仙桃市",
      "shortName": "仙桃",
      "longitude": 113.453974,
      "latitude": 30.364953
    },
    {
      "id": "420000-429005",
      "name": "潜江市",
      "shortName": "潜江",
      "longitude": 112.896866,
      "latitude": 30.421215
    },
    {
      "id": "420000-429006",
      "name": "天门市",
      "shortName": "天门",
      "longitude": 113.165862,
      "latitude": 30.653061
    },
    {
      "id": "420000-429021",
      "name": "神农架林区",
      "shortName": "神农架林区",
      "longitude": 110.671525,
      "latitude": 31.744449
    }
  ],
  "430000": [
    {
      "id": "430000-430100",
      "name": "长沙市",
      "shortName": "长沙",
      "longitude": 112.982279,
      "latitude": 28.19409
    },
    {
      "id": "430000-430200",
      "name": "株洲市",
      "shortName": "株洲",
      "longitude": 113.151737,
      "latitude": 27.835806
    },
    {
      "id": "430000-430300",
      "name": "湘潭市",
      "shortName": "湘潭",
      "longitude": 112.944052,
      "latitude": 27.82973
    },
    {
      "id": "430000-430400",
      "name": "衡阳市",
      "shortName": "衡阳",
      "longitude": 112.607693,
      "latitude": 26.900358
    },
    {
      "id": "430000-430500",
      "name": "邵阳市",
      "shortName": "邵阳",
      "longitude": 111.46923,
      "latitude": 27.237842
    },
    {
      "id": "430000-430600",
      "name": "岳阳市",
      "shortName": "岳阳",
      "longitude": 113.132855,
      "latitude": 29.37029
    },
    {
      "id": "430000-430700",
      "name": "常德市",
      "shortName": "常德",
      "longitude": 111.691347,
      "latitude": 29.040225
    },
    {
      "id": "430000-430800",
      "name": "张家界市",
      "shortName": "张家界",
      "longitude": 110.479921,
      "latitude": 29.127401
    },
    {
      "id": "430000-430900",
      "name": "益阳市",
      "shortName": "益阳",
      "longitude": 112.355042,
      "latitude": 28.570066
    },
    {
      "id": "430000-431000",
      "name": "郴州市",
      "shortName": "郴州",
      "longitude": 113.032067,
      "latitude": 25.793589
    },
    {
      "id": "430000-431100",
      "name": "永州市",
      "shortName": "永州",
      "longitude": 111.608019,
      "latitude": 26.434516
    },
    {
      "id": "430000-431200",
      "name": "怀化市",
      "shortName": "怀化",
      "longitude": 109.97824,
      "latitude": 27.550082
    },
    {
      "id": "430000-431300",
      "name": "娄底市",
      "shortName": "娄底",
      "longitude": 112.008497,
      "latitude": 27.728136
    },
    {
      "id": "430000-433100",
      "name": "湘西土家族苗族自治州",
      "shortName": "湘西土家族苗族自治州",
      "longitude": 109.739735,
      "latitude": 28.314296
    }
  ],
  "440000": [
    {
      "id": "440000-440100",
      "name": "广州市",
      "shortName": "广州",
      "longitude": 113.280637,
      "latitude": 23.125178
    },
    {
      "id": "440000-440200",
      "name": "韶关市",
      "shortName": "韶关",
      "longitude": 113.591544,
      "latitude": 24.801322
    },
    {
      "id": "440000-440300",
      "name": "深圳市",
      "shortName": "深圳",
      "longitude": 114.085947,
      "latitude": 22.547
    },
    {
      "id": "440000-440400",
      "name": "珠海市",
      "shortName": "珠海",
      "longitude": 113.553986,
      "latitude": 22.224979
    },
    {
      "id": "440000-440500",
      "name": "汕头市",
      "shortName": "汕头",
      "longitude": 116.708463,
      "latitude": 23.37102
    },
    {
      "id": "440000-440600",
      "name": "佛山市",
      "shortName": "佛山",
      "longitude": 113.122717,
      "latitude": 23.028762
    },
    {
      "id": "440000-440700",
      "name": "江门市",
      "shortName": "江门",
      "longitude": 113.094942,
      "latitude": 22.590431
    },
    {
      "id": "440000-440800",
      "name": "湛江市",
      "shortName": "湛江",
      "longitude": 110.364977,
      "latitude": 21.274898
    },
    {
      "id": "440000-440900",
      "name": "茂名市",
      "shortName": "茂名",
      "longitude": 110.919229,
      "latitude": 21.659751
    },
    {
      "id": "440000-441200",
      "name": "肇庆市",
      "shortName": "肇庆",
      "longitude": 112.472529,
      "latitude": 23.051546
    },
    {
      "id": "440000-441300",
      "name": "惠州市",
      "shortName": "惠州",
      "longitude": 114.412599,
      "latitude": 23.079404
    },
    {
      "id": "440000-441400",
      "name": "梅州市",
      "shortName": "梅州",
      "longitude": 116.117582,
      "latitude": 24.299112
    },
    {
      "id": "440000-441500",
      "name": "汕尾市",
      "shortName": "汕尾",
      "longitude": 115.364238,
      "latitude": 22.774485
    },
    {
      "id": "440000-441600",
      "name": "河源市",
      "shortName": "河源",
      "longitude": 114.697802,
      "latitude": 23.746266
    },
    {
      "id": "440000-441700",
      "name": "阳江市",
      "shortName": "阳江",
      "longitude": 111.975107,
      "latitude": 21.859222
    },
    {
      "id": "440000-441800",
      "name": "清远市",
      "shortName": "清远",
      "longitude": 113.051227,
      "latitude": 23.685022
    },
    {
      "id": "440000-441900",
      "name": "东莞市",
      "shortName": "东莞",
      "longitude": 113.746262,
      "latitude": 23.046237
    },
    {
      "id": "440000-442000",
      "name": "中山市",
      "shortName": "中山",
      "longitude": 113.382391,
      "latitude": 22.521113
    },
    {
      "id": "440000-445100",
      "name": "潮州市",
      "shortName": "潮州",
      "longitude": 116.632301,
      "latitude": 23.661701
    },
    {
      "id": "440000-445200",
      "name": "揭阳市",
      "shortName": "揭阳",
      "longitude": 116.355733,
      "latitude": 23.543778
    },
    {
      "id": "440000-445300",
      "name": "云浮市",
      "shortName": "云浮",
      "longitude": 112.044439,
      "latitude": 22.929801
    }
  ],
  "450000": [
    {
      "id": "450000-450100",
      "name": "南宁市",
      "shortName": "南宁",
      "longitude": 108.320004,
      "latitude": 22.82402
    },
    {
      "id": "450000-450200",
      "name": "柳州市",
      "shortName": "柳州",
      "longitude": 109.411703,
      "latitude": 24.314617
    },
    {
      "id": "450000-450300",
      "name": "桂林市",
      "shortName": "桂林",
      "longitude": 110.299121,
      "latitude": 25.274215
    },
    {
      "id": "450000-450400",
      "name": "梧州市",
      "shortName": "梧州",
      "longitude": 111.297604,
      "latitude": 23.474803
    },
    {
      "id": "450000-450500",
      "name": "北海市",
      "shortName": "北海",
      "longitude": 109.119254,
      "latitude": 21.473343
    },
    {
      "id": "450000-450600",
      "name": "防城港市",
      "shortName": "防城港",
      "longitude": 108.345478,
      "latitude": 21.614631
    },
    {
      "id": "450000-450700",
      "name": "钦州市",
      "shortName": "钦州",
      "longitude": 108.624175,
      "latitude": 21.967127
    },
    {
      "id": "450000-450800",
      "name": "贵港市",
      "shortName": "贵港",
      "longitude": 109.602146,
      "latitude": 23.0936
    },
    {
      "id": "450000-450900",
      "name": "玉林市",
      "shortName": "玉林",
      "longitude": 110.154393,
      "latitude": 22.63136
    },
    {
      "id": "450000-451000",
      "name": "百色市",
      "shortName": "百色",
      "longitude": 106.616285,
      "latitude": 23.897742
    },
    {
      "id": "450000-451100",
      "name": "贺州市",
      "shortName": "贺州",
      "longitude": 111.552056,
      "latitude": 24.414141
    },
    {
      "id": "450000-451200",
      "name": "河池市",
      "shortName": "河池",
      "longitude": 108.062105,
      "latitude": 24.695899
    },
    {
      "id": "450000-451300",
      "name": "来宾市",
      "shortName": "来宾",
      "longitude": 109.229772,
      "latitude": 23.733766
    },
    {
      "id": "450000-451400",
      "name": "崇左市",
      "shortName": "崇左",
      "longitude": 107.353926,
      "latitude": 22.404108
    }
  ],
  "460000": [
    {
      "id": "460000-460100",
      "name": "海口市",
      "shortName": "海口",
      "longitude": 110.33119,
      "latitude": 20.031971
    },
    {
      "id": "460000-460200",
      "name": "三亚市",
      "shortName": "三亚",
      "longitude": 109.508268,
      "latitude": 18.247872
    },
    {
      "id": "460000-460300",
      "name": "三沙市",
      "shortName": "三沙",
      "longitude": 112.34882,
      "latitude": 16.831039
    },
    {
      "id": "460000-460400",
      "name": "儋州市",
      "shortName": "儋州",
      "longitude": 109.576782,
      "latitude": 19.517486
    },
    {
      "id": "460000-469001",
      "name": "五指山市",
      "shortName": "五指山",
      "longitude": 109.516662,
      "latitude": 18.776921
    },
    {
      "id": "460000-469002",
      "name": "琼海市",
      "shortName": "琼海",
      "longitude": 110.466785,
      "latitude": 19.246011
    },
    {
      "id": "460000-469005",
      "name": "文昌市",
      "shortName": "文昌",
      "longitude": 110.753975,
      "latitude": 19.612986
    },
    {
      "id": "460000-469006",
      "name": "万宁市",
      "shortName": "万宁",
      "longitude": 110.388793,
      "latitude": 18.796216
    },
    {
      "id": "460000-469007",
      "name": "东方市",
      "shortName": "东方",
      "longitude": 108.653789,
      "latitude": 19.10198
    },
    {
      "id": "460000-469021",
      "name": "定安县",
      "shortName": "定安县",
      "longitude": 110.349235,
      "latitude": 19.684966
    },
    {
      "id": "460000-469022",
      "name": "屯昌县",
      "shortName": "屯昌县",
      "longitude": 110.102773,
      "latitude": 19.362916
    },
    {
      "id": "460000-469023",
      "name": "澄迈县",
      "shortName": "澄迈县",
      "longitude": 110.007147,
      "latitude": 19.737095
    },
    {
      "id": "460000-469024",
      "name": "临高县",
      "shortName": "临高县",
      "longitude": 109.687697,
      "latitude": 19.908293
    },
    {
      "id": "460000-469025",
      "name": "白沙黎族自治县",
      "shortName": "白沙黎族自治县",
      "longitude": 109.452606,
      "latitude": 19.224584
    },
    {
      "id": "460000-469026",
      "name": "昌江黎族自治县",
      "shortName": "昌江黎族自治县",
      "longitude": 109.053351,
      "latitude": 19.260968
    },
    {
      "id": "460000-469027",
      "name": "乐东黎族自治县",
      "shortName": "乐东黎族自治县",
      "longitude": 109.175444,
      "latitude": 18.74758
    },
    {
      "id": "460000-469028",
      "name": "陵水黎族自治县",
      "shortName": "陵水黎族自治县",
      "longitude": 110.037218,
      "latitude": 18.505006
    },
    {
      "id": "460000-469029",
      "name": "保亭黎族苗族自治县",
      "shortName": "保亭黎族苗族自治县",
      "longitude": 109.70245,
      "latitude": 18.636371
    },
    {
      "id": "460000-469030",
      "name": "琼中黎族苗族自治县",
      "shortName": "琼中黎族苗族自治县",
      "longitude": 109.839996,
      "latitude": 19.03557
    }
  ],
  "500000": [
    {
      "id": "500000-500101",
      "name": "万州区",
      "shortName": "万州区",
      "longitude": 108.380246,
      "latitude": 30.807807
    },
    {
      "id": "500000-500102",
      "name": "涪陵区",
      "shortName": "涪陵区",
      "longitude": 107.394905,
      "latitude": 29.703652
    },
    {
      "id": "500000-500103",
      "name": "渝中区",
      "shortName": "渝中区",
      "longitude": 106.56288,
      "latitude": 29.556742
    },
    {
      "id": "500000-500104",
      "name": "大渡口区",
      "shortName": "大渡口区",
      "longitude": 106.48613,
      "latitude": 29.481002
    },
    {
      "id": "500000-500105",
      "name": "江北区",
      "shortName": "江北区",
      "longitude": 106.532844,
      "latitude": 29.575352
    },
    {
      "id": "500000-500106",
      "name": "沙坪坝区",
      "shortName": "沙坪坝区",
      "longitude": 106.4542,
      "latitude": 29.541224
    },
    {
      "id": "500000-500107",
      "name": "九龙坡区",
      "shortName": "九龙坡区",
      "longitude": 106.480989,
      "latitude": 29.523492
    },
    {
      "id": "500000-500108",
      "name": "南岸区",
      "shortName": "南岸区",
      "longitude": 106.560813,
      "latitude": 29.523992
    },
    {
      "id": "500000-500109",
      "name": "北碚区",
      "shortName": "北碚区",
      "longitude": 106.437868,
      "latitude": 29.82543
    },
    {
      "id": "500000-500110",
      "name": "綦江区",
      "shortName": "綦江区",
      "longitude": 106.651417,
      "latitude": 29.028091
    },
    {
      "id": "500000-500111",
      "name": "大足区",
      "shortName": "大足区",
      "longitude": 105.715319,
      "latitude": 29.700498
    },
    {
      "id": "500000-500112",
      "name": "渝北区",
      "shortName": "渝北区",
      "longitude": 106.512851,
      "latitude": 29.601451
    },
    {
      "id": "500000-500113",
      "name": "巴南区",
      "shortName": "巴南区",
      "longitude": 106.519423,
      "latitude": 29.381919
    },
    {
      "id": "500000-500114",
      "name": "黔江区",
      "shortName": "黔江区",
      "longitude": 108.782577,
      "latitude": 29.527548
    },
    {
      "id": "500000-500115",
      "name": "长寿区",
      "shortName": "长寿区",
      "longitude": 107.074854,
      "latitude": 29.833671
    },
    {
      "id": "500000-500116",
      "name": "江津区",
      "shortName": "江津区",
      "longitude": 106.253156,
      "latitude": 29.283387
    },
    {
      "id": "500000-500117",
      "name": "合川区",
      "shortName": "合川区",
      "longitude": 106.265554,
      "latitude": 29.990993
    },
    {
      "id": "500000-500118",
      "name": "永川区",
      "shortName": "永川区",
      "longitude": 105.894714,
      "latitude": 29.348748
    },
    {
      "id": "500000-500119",
      "name": "南川区",
      "shortName": "南川区",
      "longitude": 107.098153,
      "latitude": 29.156646
    },
    {
      "id": "500000-500120",
      "name": "璧山区",
      "shortName": "璧山区",
      "longitude": 106.231126,
      "latitude": 29.593581
    },
    {
      "id": "500000-500151",
      "name": "铜梁区",
      "shortName": "铜梁区",
      "longitude": 106.054948,
      "latitude": 29.839944
    },
    {
      "id": "500000-500152",
      "name": "潼南区",
      "shortName": "潼南区",
      "longitude": 105.841818,
      "latitude": 30.189554
    },
    {
      "id": "500000-500153",
      "name": "荣昌区",
      "shortName": "荣昌区",
      "longitude": 105.594061,
      "latitude": 29.403627
    },
    {
      "id": "500000-500154",
      "name": "开州区",
      "shortName": "开州区",
      "longitude": 108.413317,
      "latitude": 31.167735
    },
    {
      "id": "500000-500155",
      "name": "梁平区",
      "shortName": "梁平区",
      "longitude": 107.800034,
      "latitude": 30.672168
    },
    {
      "id": "500000-500156",
      "name": "武隆区",
      "shortName": "武隆区",
      "longitude": 107.75655,
      "latitude": 29.32376
    },
    {
      "id": "500000-500229",
      "name": "城口县",
      "shortName": "城口县",
      "longitude": 108.6649,
      "latitude": 31.946293
    },
    {
      "id": "500000-500230",
      "name": "丰都县",
      "shortName": "丰都县",
      "longitude": 107.73248,
      "latitude": 29.866424
    },
    {
      "id": "500000-500231",
      "name": "垫江县",
      "shortName": "垫江县",
      "longitude": 107.348692,
      "latitude": 30.330012
    },
    {
      "id": "500000-500233",
      "name": "忠县",
      "shortName": "忠县",
      "longitude": 108.037518,
      "latitude": 30.291537
    },
    {
      "id": "500000-500235",
      "name": "云阳县",
      "shortName": "云阳县",
      "longitude": 108.697698,
      "latitude": 30.930529
    },
    {
      "id": "500000-500236",
      "name": "奉节县",
      "shortName": "奉节县",
      "longitude": 109.465774,
      "latitude": 31.019967
    },
    {
      "id": "500000-500237",
      "name": "巫山县",
      "shortName": "巫山县",
      "longitude": 109.878928,
      "latitude": 31.074843
    },
    {
      "id": "500000-500238",
      "name": "巫溪县",
      "shortName": "巫溪县",
      "longitude": 109.628912,
      "latitude": 31.3966
    },
    {
      "id": "500000-500240",
      "name": "石柱土家族自治县",
      "shortName": "石柱土家族自治县",
      "longitude": 108.112448,
      "latitude": 29.99853
    },
    {
      "id": "500000-500241",
      "name": "秀山土家族苗族自治县",
      "shortName": "秀山土家族苗族自治县",
      "longitude": 108.996043,
      "latitude": 28.444772
    },
    {
      "id": "500000-500242",
      "name": "酉阳土家族苗族自治县",
      "shortName": "酉阳土家族苗族自治县",
      "longitude": 108.767201,
      "latitude": 28.839828
    },
    {
      "id": "500000-500243",
      "name": "彭水苗族土家族自治县",
      "shortName": "彭水苗族土家族自治县",
      "longitude": 108.166551,
      "latitude": 29.293856
    }
  ],
  "510000": [
    {
      "id": "510000-510100",
      "name": "成都市",
      "shortName": "成都",
      "longitude": 104.065735,
      "latitude": 30.659462
    },
    {
      "id": "510000-510300",
      "name": "自贡市",
      "shortName": "自贡",
      "longitude": 104.773447,
      "latitude": 29.352765
    },
    {
      "id": "510000-510400",
      "name": "攀枝花市",
      "shortName": "攀枝花",
      "longitude": 101.716007,
      "latitude": 26.580446
    },
    {
      "id": "510000-510500",
      "name": "泸州市",
      "shortName": "泸州",
      "longitude": 105.443348,
      "latitude": 28.889138
    },
    {
      "id": "510000-510600",
      "name": "德阳市",
      "shortName": "德阳",
      "longitude": 104.398651,
      "latitude": 31.127991
    },
    {
      "id": "510000-510700",
      "name": "绵阳市",
      "shortName": "绵阳",
      "longitude": 104.741722,
      "latitude": 31.46402
    },
    {
      "id": "510000-510800",
      "name": "广元市",
      "shortName": "广元",
      "longitude": 105.829757,
      "latitude": 32.433668
    },
    {
      "id": "510000-510900",
      "name": "遂宁市",
      "shortName": "遂宁",
      "longitude": 105.571331,
      "latitude": 30.513311
    },
    {
      "id": "510000-511000",
      "name": "内江市",
      "shortName": "内江",
      "longitude": 105.066138,
      "latitude": 29.58708
    },
    {
      "id": "510000-511100",
      "name": "乐山市",
      "shortName": "乐山",
      "longitude": 103.761263,
      "latitude": 29.582024
    },
    {
      "id": "510000-511300",
      "name": "南充市",
      "shortName": "南充",
      "longitude": 106.082974,
      "latitude": 30.795281
    },
    {
      "id": "510000-511400",
      "name": "眉山市",
      "shortName": "眉山",
      "longitude": 103.831788,
      "latitude": 30.048318
    },
    {
      "id": "510000-511500",
      "name": "宜宾市",
      "shortName": "宜宾",
      "longitude": 104.630825,
      "latitude": 28.760189
    },
    {
      "id": "510000-511600",
      "name": "广安市",
      "shortName": "广安",
      "longitude": 106.633369,
      "latitude": 30.456398
    },
    {
      "id": "510000-511700",
      "name": "达州市",
      "shortName": "达州",
      "longitude": 107.502262,
      "latitude": 31.209484
    },
    {
      "id": "510000-511800",
      "name": "雅安市",
      "shortName": "雅安",
      "longitude": 103.001033,
      "latitude": 29.987722
    },
    {
      "id": "510000-511900",
      "name": "巴中市",
      "shortName": "巴中",
      "longitude": 106.753669,
      "latitude": 31.858809
    },
    {
      "id": "510000-512000",
      "name": "资阳市",
      "shortName": "资阳",
      "longitude": 104.641917,
      "latitude": 30.122211
    },
    {
      "id": "510000-513200",
      "name": "阿坝藏族羌族自治州",
      "shortName": "阿坝藏族羌族自治州",
      "longitude": 102.221374,
      "latitude": 31.899792
    },
    {
      "id": "510000-513300",
      "name": "甘孜藏族自治州",
      "shortName": "甘孜藏族自治州",
      "longitude": 101.963815,
      "latitude": 30.050663
    },
    {
      "id": "510000-513400",
      "name": "凉山彝族自治州",
      "shortName": "凉山彝族自治州",
      "longitude": 102.258746,
      "latitude": 27.886762
    }
  ],
  "520000": [
    {
      "id": "520000-520100",
      "name": "贵阳市",
      "shortName": "贵阳",
      "longitude": 106.713478,
      "latitude": 26.578343
    },
    {
      "id": "520000-520200",
      "name": "六盘水市",
      "shortName": "六盘水",
      "longitude": 104.846743,
      "latitude": 26.584643
    },
    {
      "id": "520000-520300",
      "name": "遵义市",
      "shortName": "遵义",
      "longitude": 106.937265,
      "latitude": 27.706626
    },
    {
      "id": "520000-520400",
      "name": "安顺市",
      "shortName": "安顺",
      "longitude": 105.932188,
      "latitude": 26.245544
    },
    {
      "id": "520000-520500",
      "name": "毕节市",
      "shortName": "毕节",
      "longitude": 105.28501,
      "latitude": 27.301693
    },
    {
      "id": "520000-520600",
      "name": "铜仁市",
      "shortName": "铜仁",
      "longitude": 109.191555,
      "latitude": 27.718346
    },
    {
      "id": "520000-522300",
      "name": "黔西南布依族苗族自治州",
      "shortName": "黔西南布依族苗族自治州",
      "longitude": 104.897971,
      "latitude": 25.08812
    },
    {
      "id": "520000-522600",
      "name": "黔东南苗族侗族自治州",
      "shortName": "黔东南苗族侗族自治州",
      "longitude": 107.977488,
      "latitude": 26.583352
    },
    {
      "id": "520000-522700",
      "name": "黔南布依族苗族自治州",
      "shortName": "黔南布依族苗族自治州",
      "longitude": 107.517156,
      "latitude": 26.258219
    }
  ],
  "530000": [
    {
      "id": "530000-530100",
      "name": "昆明市",
      "shortName": "昆明",
      "longitude": 102.712251,
      "latitude": 25.040609
    },
    {
      "id": "530000-530300",
      "name": "曲靖市",
      "shortName": "曲靖",
      "longitude": 103.797851,
      "latitude": 25.501557
    },
    {
      "id": "530000-530400",
      "name": "玉溪市",
      "shortName": "玉溪",
      "longitude": 102.543907,
      "latitude": 24.350461
    },
    {
      "id": "530000-530500",
      "name": "保山市",
      "shortName": "保山",
      "longitude": 99.167133,
      "latitude": 25.111802
    },
    {
      "id": "530000-530600",
      "name": "昭通市",
      "shortName": "昭通",
      "longitude": 103.717216,
      "latitude": 27.336999
    },
    {
      "id": "530000-530700",
      "name": "丽江市",
      "shortName": "丽江",
      "longitude": 100.233026,
      "latitude": 26.872108
    },
    {
      "id": "530000-530800",
      "name": "普洱市",
      "shortName": "普洱",
      "longitude": 100.972344,
      "latitude": 22.777321
    },
    {
      "id": "530000-530900",
      "name": "临沧市",
      "shortName": "临沧",
      "longitude": 100.08697,
      "latitude": 23.886567
    },
    {
      "id": "530000-532300",
      "name": "楚雄彝族自治州",
      "shortName": "楚雄彝族自治州",
      "longitude": 101.546046,
      "latitude": 25.041988
    },
    {
      "id": "530000-532500",
      "name": "红河哈尼族彝族自治州",
      "shortName": "红河哈尼族彝族自治州",
      "longitude": 103.384182,
      "latitude": 23.366775
    },
    {
      "id": "530000-532600",
      "name": "文山壮族苗族自治州",
      "shortName": "文山壮族苗族自治州",
      "longitude": 104.24401,
      "latitude": 23.36951
    },
    {
      "id": "530000-532800",
      "name": "西双版纳傣族自治州",
      "shortName": "西双版纳傣族自治州",
      "longitude": 100.797941,
      "latitude": 22.001724
    },
    {
      "id": "530000-532900",
      "name": "大理白族自治州",
      "shortName": "大理白族自治州",
      "longitude": 100.225668,
      "latitude": 25.589449
    },
    {
      "id": "530000-533100",
      "name": "德宏傣族景颇族自治州",
      "shortName": "德宏傣族景颇族自治州",
      "longitude": 98.578363,
      "latitude": 24.436694
    },
    {
      "id": "530000-533300",
      "name": "怒江傈僳族自治州",
      "shortName": "怒江傈僳族自治州",
      "longitude": 98.854304,
      "latitude": 25.850949
    },
    {
      "id": "530000-533400",
      "name": "迪庆藏族自治州",
      "shortName": "迪庆藏族自治州",
      "longitude": 99.706463,
      "latitude": 27.826853
    }
  ],
  "540000": [
    {
      "id": "540000-540100",
      "name": "拉萨市",
      "shortName": "拉萨",
      "longitude": 91.132212,
      "latitude": 29.660361
    },
    {
      "id": "540000-540200",
      "name": "日喀则市",
      "shortName": "日喀则",
      "longitude": 88.885148,
      "latitude": 29.267519
    },
    {
      "id": "540000-540300",
      "name": "昌都市",
      "shortName": "昌都",
      "longitude": 97.178452,
      "latitude": 31.136875
    },
    {
      "id": "540000-540400",
      "name": "林芝市",
      "shortName": "林芝",
      "longitude": 94.362348,
      "latitude": 29.654693
    },
    {
      "id": "540000-540500",
      "name": "山南市",
      "shortName": "山南",
      "longitude": 91.766529,
      "latitude": 29.236023
    },
    {
      "id": "540000-540600",
      "name": "那曲市",
      "shortName": "那曲",
      "longitude": 92.060214,
      "latitude": 31.476004
    },
    {
      "id": "540000-542500",
      "name": "阿里地区",
      "shortName": "阿里地区",
      "longitude": 80.105498,
      "latitude": 32.503187
    }
  ],
  "610000": [
    {
      "id": "610000-610100",
      "name": "西安市",
      "shortName": "西安",
      "longitude": 108.948024,
      "latitude": 34.263161
    },
    {
      "id": "610000-610200",
      "name": "铜川市",
      "shortName": "铜川",
      "longitude": 108.979608,
      "latitude": 34.916582
    },
    {
      "id": "610000-610300",
      "name": "宝鸡市",
      "shortName": "宝鸡",
      "longitude": 107.14487,
      "latitude": 34.369315
    },
    {
      "id": "610000-610400",
      "name": "咸阳市",
      "shortName": "咸阳",
      "longitude": 108.705117,
      "latitude": 34.333439
    },
    {
      "id": "610000-610500",
      "name": "渭南市",
      "shortName": "渭南",
      "longitude": 109.502882,
      "latitude": 34.499381
    },
    {
      "id": "610000-610600",
      "name": "延安市",
      "shortName": "延安",
      "longitude": 109.49081,
      "latitude": 36.596537
    },
    {
      "id": "610000-610700",
      "name": "汉中市",
      "shortName": "汉中",
      "longitude": 107.028621,
      "latitude": 33.077668
    },
    {
      "id": "610000-610800",
      "name": "榆林市",
      "shortName": "榆林",
      "longitude": 109.741193,
      "latitude": 38.290162
    },
    {
      "id": "610000-610900",
      "name": "安康市",
      "shortName": "安康",
      "longitude": 109.029273,
      "latitude": 32.6903
    },
    {
      "id": "610000-611000",
      "name": "商洛市",
      "shortName": "商洛",
      "longitude": 109.939776,
      "latitude": 33.868319
    }
  ],
  "620000": [
    {
      "id": "620000-620100",
      "name": "兰州市",
      "shortName": "兰州",
      "longitude": 103.823557,
      "latitude": 36.058039
    },
    {
      "id": "620000-620200",
      "name": "嘉峪关市",
      "shortName": "嘉峪关",
      "longitude": 98.277304,
      "latitude": 39.786529
    },
    {
      "id": "620000-620300",
      "name": "金昌市",
      "shortName": "金昌",
      "longitude": 102.187888,
      "latitude": 38.514238
    },
    {
      "id": "620000-620400",
      "name": "白银市",
      "shortName": "白银",
      "longitude": 104.173606,
      "latitude": 36.54568
    },
    {
      "id": "620000-620500",
      "name": "天水市",
      "shortName": "天水",
      "longitude": 105.724998,
      "latitude": 34.578529
    },
    {
      "id": "620000-620600",
      "name": "武威市",
      "shortName": "武威",
      "longitude": 102.634697,
      "latitude": 37.929996
    },
    {
      "id": "620000-620700",
      "name": "张掖市",
      "shortName": "张掖",
      "longitude": 100.455472,
      "latitude": 38.932897
    },
    {
      "id": "620000-620800",
      "name": "平凉市",
      "shortName": "平凉",
      "longitude": 106.684691,
      "latitude": 35.54279
    },
    {
      "id": "620000-620900",
      "name": "酒泉市",
      "shortName": "酒泉",
      "longitude": 98.510795,
      "latitude": 39.744023
    },
    {
      "id": "620000-621000",
      "name": "庆阳市",
      "shortName": "庆阳",
      "longitude": 107.638372,
      "latitude": 35.734218
    },
    {
      "id": "620000-621100",
      "name": "定西市",
      "shortName": "定西",
      "longitude": 104.626294,
      "latitude": 35.579578
    },
    {
      "id": "620000-621200",
      "name": "陇南市",
      "shortName": "陇南",
      "longitude": 104.929379,
      "latitude": 33.388598
    },
    {
      "id": "620000-622900",
      "name": "临夏回族自治州",
      "shortName": "临夏回族自治州",
      "longitude": 103.212006,
      "latitude": 35.599446
    },
    {
      "id": "620000-623000",
      "name": "甘南藏族自治州",
      "shortName": "甘南藏族自治州",
      "longitude": 102.911008,
      "latitude": 34.986354
    }
  ],
  "630000": [
    {
      "id": "630000-630100",
      "name": "西宁市",
      "shortName": "西宁",
      "longitude": 101.778916,
      "latitude": 36.623178
    },
    {
      "id": "630000-630200",
      "name": "海东市",
      "shortName": "海东",
      "longitude": 102.10327,
      "latitude": 36.502916
    },
    {
      "id": "630000-632200",
      "name": "海北藏族自治州",
      "shortName": "海北藏族自治州",
      "longitude": 100.901059,
      "latitude": 36.959435
    },
    {
      "id": "630000-632300",
      "name": "黄南藏族自治州",
      "shortName": "黄南藏族自治州",
      "longitude": 102.019988,
      "latitude": 35.517744
    },
    {
      "id": "630000-632500",
      "name": "海南藏族自治州",
      "shortName": "海南藏族自治州",
      "longitude": 100.619542,
      "latitude": 36.280353
    },
    {
      "id": "630000-632600",
      "name": "果洛藏族自治州",
      "shortName": "果洛藏族自治州",
      "longitude": 100.242143,
      "latitude": 34.4736
    },
    {
      "id": "630000-632700",
      "name": "玉树藏族自治州",
      "shortName": "玉树藏族自治州",
      "longitude": 97.008522,
      "latitude": 33.004049
    },
    {
      "id": "630000-632800",
      "name": "海西蒙古族藏族自治州",
      "shortName": "海西蒙古族藏族自治州",
      "longitude": 97.370785,
      "latitude": 37.374663
    }
  ],
  "640000": [
    {
      "id": "640000-640100",
      "name": "银川市",
      "shortName": "银川",
      "longitude": 106.278179,
      "latitude": 38.46637
    },
    {
      "id": "640000-640200",
      "name": "石嘴山市",
      "shortName": "石嘴山",
      "longitude": 106.376173,
      "latitude": 39.01333
    },
    {
      "id": "640000-640300",
      "name": "吴忠市",
      "shortName": "吴忠",
      "longitude": 106.199409,
      "latitude": 37.986165
    },
    {
      "id": "640000-640400",
      "name": "固原市",
      "shortName": "固原",
      "longitude": 106.285241,
      "latitude": 36.004561
    },
    {
      "id": "640000-640500",
      "name": "中卫市",
      "shortName": "中卫",
      "longitude": 105.189568,
      "latitude": 37.514951
    }
  ],
  "650000": [
    {
      "id": "650000-650100",
      "name": "乌鲁木齐市",
      "shortName": "乌鲁木齐",
      "longitude": 87.617733,
      "latitude": 43.792818
    },
    {
      "id": "650000-650200",
      "name": "克拉玛依市",
      "shortName": "克拉玛依",
      "longitude": 84.873946,
      "latitude": 45.595886
    },
    {
      "id": "650000-650400",
      "name": "吐鲁番市",
      "shortName": "吐鲁番",
      "longitude": 89.184078,
      "latitude": 42.947613
    },
    {
      "id": "650000-650500",
      "name": "哈密市",
      "shortName": "哈密",
      "longitude": 93.51316,
      "latitude": 42.833248
    },
    {
      "id": "650000-652300",
      "name": "昌吉回族自治州",
      "shortName": "昌吉回族自治州",
      "longitude": 87.304012,
      "latitude": 44.014577
    },
    {
      "id": "650000-652700",
      "name": "博尔塔拉蒙古自治州",
      "shortName": "博尔塔拉蒙古自治州",
      "longitude": 82.074778,
      "latitude": 44.903258
    },
    {
      "id": "650000-652800",
      "name": "巴音郭楞蒙古自治州",
      "shortName": "巴音郭楞蒙古自治州",
      "longitude": 86.150969,
      "latitude": 41.768552
    },
    {
      "id": "650000-652900",
      "name": "阿克苏地区",
      "shortName": "阿克苏地区",
      "longitude": 80.265068,
      "latitude": 41.170712
    },
    {
      "id": "650000-653000",
      "name": "克孜勒苏柯尔克孜自治州",
      "shortName": "克孜勒苏柯尔克孜自治州",
      "longitude": 76.172825,
      "latitude": 39.713431
    },
    {
      "id": "650000-653100",
      "name": "喀什地区",
      "shortName": "喀什地区",
      "longitude": 75.989138,
      "latitude": 39.467664
    },
    {
      "id": "650000-653200",
      "name": "和田地区",
      "shortName": "和田地区",
      "longitude": 79.92533,
      "latitude": 37.110687
    },
    {
      "id": "650000-654000",
      "name": "伊犁哈萨克自治州",
      "shortName": "伊犁哈萨克自治州",
      "longitude": 81.317946,
      "latitude": 43.92186
    },
    {
      "id": "650000-654200",
      "name": "塔城地区",
      "shortName": "塔城地区",
      "longitude": 82.985732,
      "latitude": 46.746301
    },
    {
      "id": "650000-654300",
      "name": "阿勒泰地区",
      "shortName": "阿勒泰地区",
      "longitude": 88.13963,
      "latitude": 47.848393
    },
    {
      "id": "650000-659001",
      "name": "石河子市",
      "shortName": "石河子",
      "longitude": 86.041075,
      "latitude": 44.305886
    },
    {
      "id": "650000-659002",
      "name": "阿拉尔市",
      "shortName": "阿拉尔",
      "longitude": 81.285884,
      "latitude": 40.541914
    },
    {
      "id": "650000-659003",
      "name": "图木舒克市",
      "shortName": "图木舒克",
      "longitude": 79.077978,
      "latitude": 39.867316
    },
    {
      "id": "650000-659004",
      "name": "五家渠市",
      "shortName": "五家渠",
      "longitude": 87.526884,
      "latitude": 44.167401
    },
    {
      "id": "650000-659005",
      "name": "北屯市",
      "shortName": "北屯",
      "longitude": 87.824932,
      "latitude": 47.353177
    },
    {
      "id": "650000-659006",
      "name": "铁门关市",
      "shortName": "铁门关",
      "longitude": 85.501218,
      "latitude": 41.827251
    },
    {
      "id": "650000-659007",
      "name": "双河市",
      "shortName": "双河",
      "longitude": 82.353656,
      "latitude": 44.840524
    },
    {
      "id": "650000-659008",
      "name": "可克达拉市",
      "shortName": "可克达拉",
      "longitude": 80.63579,
      "latitude": 43.6832
    },
    {
      "id": "650000-659009",
      "name": "昆玉市",
      "shortName": "昆玉",
      "longitude": 79.287372,
      "latitude": 37.207994
    },
    {
      "id": "650000-659010",
      "name": "胡杨河市",
      "shortName": "胡杨河",
      "longitude": 84.8275959,
      "latitude": 44.69288853
    }
  ],
  "710000": [
    {
      "id": "710000-710000",
      "name": "台湾省",
      "shortName": "台湾",
      "longitude": 121.509062,
      "latitude": 25.044332
    }
  ],
  "810000": [
    {
      "id": "810000-810001",
      "name": "中西区",
      "shortName": "中西区",
      "longitude": 114.1543731,
      "latitude": 22.28198083
    },
    {
      "id": "810000-810002",
      "name": "湾仔区",
      "shortName": "湾仔区",
      "longitude": 114.1829153,
      "latitude": 22.27638889
    },
    {
      "id": "810000-810003",
      "name": "东区",
      "shortName": "东区",
      "longitude": 114.2260031,
      "latitude": 22.27969306
    },
    {
      "id": "810000-810004",
      "name": "南区",
      "shortName": "南区",
      "longitude": 114.1600117,
      "latitude": 22.24589667
    },
    {
      "id": "810000-810005",
      "name": "油尖旺区",
      "shortName": "油尖旺区",
      "longitude": 114.1733317,
      "latitude": 22.31170389
    },
    {
      "id": "810000-810006",
      "name": "深水埗区",
      "shortName": "深水埗区",
      "longitude": 114.1632417,
      "latitude": 22.33385417
    },
    {
      "id": "810000-810007",
      "name": "九龙城区",
      "shortName": "九龙城区",
      "longitude": 114.1928467,
      "latitude": 22.31251
    },
    {
      "id": "810000-810008",
      "name": "黄大仙区",
      "shortName": "黄大仙区",
      "longitude": 114.2038856,
      "latitude": 22.33632056
    },
    {
      "id": "810000-810009",
      "name": "观塘区",
      "shortName": "观塘区",
      "longitude": 114.2140542,
      "latitude": 22.32083778
    },
    {
      "id": "810000-810010",
      "name": "荃湾区",
      "shortName": "荃湾区",
      "longitude": 114.1210792,
      "latitude": 22.36830667
    },
    {
      "id": "810000-810011",
      "name": "屯门区",
      "shortName": "屯门区",
      "longitude": 113.9765742,
      "latitude": 22.39384417
    },
    {
      "id": "810000-810012",
      "name": "元朗区",
      "shortName": "元朗区",
      "longitude": 114.0324381,
      "latitude": 22.44142833
    },
    {
      "id": "810000-810013",
      "name": "北区",
      "shortName": "北区",
      "longitude": 114.1473639,
      "latitude": 22.49610389
    },
    {
      "id": "810000-810014",
      "name": "大埔区",
      "shortName": "大埔区",
      "longitude": 114.1717431,
      "latitude": 22.44565306
    },
    {
      "id": "810000-810015",
      "name": "西贡区",
      "shortName": "西贡区",
      "longitude": 114.264645,
      "latitude": 22.31421306
    },
    {
      "id": "810000-810016",
      "name": "沙田区",
      "shortName": "沙田区",
      "longitude": 114.1953653,
      "latitude": 22.37953167
    },
    {
      "id": "810000-810017",
      "name": "葵青区",
      "shortName": "葵青区",
      "longitude": 114.1393194,
      "latitude": 22.36387667
    },
    {
      "id": "810000-810018",
      "name": "离岛区",
      "shortName": "离岛区",
      "longitude": 113.94612,
      "latitude": 22.28640778
    }
  ],
  "820000": [
    {
      "id": "820000-820001",
      "name": "花地玛堂区",
      "shortName": "花地玛堂区",
      "longitude": 113.5528956,
      "latitude": 22.20787
    },
    {
      "id": "820000-820002",
      "name": "花王堂区",
      "shortName": "花王堂区",
      "longitude": 113.5489608,
      "latitude": 22.1992075
    },
    {
      "id": "820000-820003",
      "name": "望德堂区",
      "shortName": "望德堂区",
      "longitude": 113.5501828,
      "latitude": 22.19372083
    },
    {
      "id": "820000-820004",
      "name": "大堂区",
      "shortName": "大堂区",
      "longitude": 113.5536475,
      "latitude": 22.18853944
    },
    {
      "id": "820000-820005",
      "name": "风顺堂区",
      "shortName": "风顺堂区",
      "longitude": 113.5419278,
      "latitude": 22.18736806
    },
    {
      "id": "820000-820006",
      "name": "嘉模堂区",
      "shortName": "嘉模堂区",
      "longitude": 113.5587044,
      "latitude": 22.15375944
    },
    {
      "id": "820000-820007",
      "name": "路凼填海区",
      "shortName": "路凼填海区",
      "longitude": 113.5695992,
      "latitude": 22.13663
    },
    {
      "id": "820000-820008",
      "name": "圣方济各堂区",
      "shortName": "圣方济各堂区",
      "longitude": 113.5599542,
      "latitude": 22.12348639
    }
  ]
};

export const REGION_OPTIONS: RegionOption[] = [CHINA_REGION, ...PROVINCE_REGIONS];

export function getRegionOption(regionId: string | undefined): RegionOption {
  return REGION_OPTIONS.find((region) => region.id === normalizeRegionId(regionId)) ?? CHINA_REGION;
}

export function normalizeRegionId(regionId: string | undefined): string {
  if (!regionId) return DEFAULT_REGION_ID;
  return REGION_OPTIONS.some((region) => region.id === regionId) ? regionId : DEFAULT_REGION_ID;
}

export function getRegionSamplePoints(regionId: string | undefined): HenanCity[] {
  const normalized = normalizeRegionId(regionId);
  if (normalized === DEFAULT_REGION_ID) return NATIONAL_SAMPLES;
  return PROVINCE_SAMPLES[normalized] ?? [regionToPoint(getRegionOption(normalized))];
}

const DIRECT_REGION_IDS = new Set(["110000", "120000", "310000", "500000", "710000", "810000", "820000"]);

export function getRegionBenchmarkPoint(regionId: string | undefined): HenanCity {
  const normalized = normalizeRegionId(regionId);
  if (normalized === DEFAULT_REGION_ID) {
    return {
      id: "beijing",
      name: "北京",
      shortName: "北京",
      latitude: 39.904989,
      longitude: 116.405285
    };
  }

  const region = getRegionOption(normalized);
  if (DIRECT_REGION_IDS.has(normalized)) {
    return regionToPoint(region);
  }

  return getRegionSamplePoints(normalized)[0] ?? regionToPoint(region);
}

function regionToPoint(region: RegionOption): HenanCity {
  return {
    id: region.id,
    name: region.name,
    shortName: region.shortName,
    latitude: region.latitude,
    longitude: region.longitude
  };
}
