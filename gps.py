import urllib.request
import time

flightPath = [
    {
        "lat": 37.33582952198526,
        "lng": -121.8860417663386
    },
    {
        "lat": 37.339207533861604,
        "lng": -121.88417508820064
    },
    {
        "lat": 37.33876395699294,
        "lng": -121.87969036810613
    },
    {
        "lat": 37.338251982493155,
        "lng": -121.87542026591778
    },
    {
        "lat": 37.33458465082077,
        "lng": -121.87648972528812
    },
    {
        "lat": 37.33058525152201,
        "lng": -121.87776962108254
    },
    {
        "lat": 37.33153381150265,
        "lng": -121.88283012650538
    },
    {
        "lat": 37.33305216946022,
        "lng": -121.88709997930538
    }
]


def location():
    count = 0
    while True:
        if count == 8:
            count = 0
        coord = flightPath[count]
        data1=urllib.request.urlopen("https://api.thingspeak.com/update?api_key=FY75NMA95F11M8OA&field1="+ str(coord["lat"]));
        print (data1);
        data2=urllib.request.urlopen("https://api.thingspeak.com/update?api_key=U6MA881OO5AM461D&field1="+ str(coord["lng"]));
        print (data2);
        print("sleeping")
        time.sleep(15);
        print("waking up")
        count += 1

location()