

const img = document.getElementById('mitmap');
const imgWidth = img.clientWidth;
const imgHeight = img.clientHeight;
console.log(imgHeight);
console.log(imgWidth);
// Create an SVG overlay
const svg_d3 = d3.select(".map-div")
    .append("svg")
    .attr("id", "map-svg")
    .attr("width", imgWidth)
    .attr("height", imgHeight)
    .style("position", "absolute")
    .style("top", 0)
    .style("left", 0);

const svg_html = document.getElementById("map-svg");

const topLeftLat = 42.35947327505247;
const topLeftLon = -71.0937368148758;
const topRightLat = 42.36044074414819;
const topRightLon = -71.09072910993062;
const botLeftLat = 42.357602133055394;
const botLeftLon = -71.0925693264241;
const botRightLat = 42.358576482949374;
const botRightLon = -71.08965232517743;

function round(x) {
    return 10 * Math.round(x / 10)
}

function getLatLon(x, y) {
    latitude = topLeftLat + x * (topRightLat - topLeftLat) / imgWidth + y * (botLeftLat - topLeftLat) / imgHeight;
    longitude = topLeftLon + x * (topRightLon - topLeftLon) / imgWidth + y * (botLeftLon - topLeftLon) / imgHeight;
    return { lat: latitude, lon: longitude };
}


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function referNodeByID(x) {
    for (thing of buildingNodes) {
        if (thing.getLabel() == x) {
            return thing;
        }
    }
    for (thing of cornerNodes) {
        if (thing.getLabel() == x) {
            return thing;
        }
    }
}

function showPosition(pos) {
    document.getElementById("loc").innerHTML
        = `Lat = ${pos.coords.latitude} <br>Lon = ${pos.coords.longitude} <br><a href="https://www.google.com/maps/place/${42.35908168906567},${-71.09437187792236}" target="_blank">Google Maps Link</a>`
}


class Node {
    constructor(lat, lon, label = "") {
        this.lon = lon;
        this.lat = lat;
        this.num = label;

        adjlist.set(this, []);
    }

    getPosition() {
        return `Node is located at (${this.lon}, ${this.lat})`;
    }

    getLon() {
        return this.lon;
    }
    getLat() {
        return this.lat;
    }
    getLabel() {
        return this.num;
    }
}

class Corner extends Node {
    constructor(lon, lat, num) { //important: swapped lon lat
        super(lat, lon, num);
        const pixel = getPixelPosition(lat, lon);
        // console.log(pixel);
        drawDot(pixel.x, pixel.y);
    }

    getPosition() {
        return `Corner is located at (${this.lon}, ${this.lat})`;
    }
    getLabel() {
        return this.num;
    }
}

class Building extends Node {
    constructor(lat, lon, num) {
        super(lat, lon, num);
        this.num = num; // building number

        const pixel = getPixelPosition(lat, lon);
        // console.log(pixel);
        drawPoint(pixel.x, pixel.y, num);
    }

    // Method to display the building's position
    getPosition() {
        return `Building is located at (${this.lon}, ${this.lat})`;
    }

    getNumber() {
        return this.num;
    }

    // Method to update the building's position
    updatePosition(newlon, newlat) {
        this.lon = newlon;
        this.lat = newlat;
    }
}

// function calculateDistance(lat1, lon1, lat2, lon2) {
//     const R = 6371; // Earth's radius in kilometers

//     // Convert latitude and longitude to radians
//     const lat1Rad = toRadians(lat1);
//     const lon1Rad = toRadians(lon1);
//     const lat2Rad = toRadians(lat2);
//     const lon2Rad = toRadians(lon2);

//     // Calculate differences
//     const dLat = lat2Rad - lat1Rad;
//     const dLon = lon2Rad - lon1Rad;

//     // Haversine formula
//     const a = Math.sin(dLat / 2) ** 2 +
//         Math.cos(lat1Rad) * Math.cos(lat2Rad) *
//         Math.sin(dLon / 2) ** 2;
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     // Calculate the distance
//     const distance = R * c;

//     return distance; // Returns distance in meters
// }


let adjlist = new Map(); // {nod1: [[nod2, dist], ...], ...}
// adjlist.set(nod1, [])
// adjlist.get(nod1).push([nod2, dist])

adjlist = new Map([
    [new Building(42.358173197989466,-71.09259483663683,"1"), [[new Corner(-71.09262316786787,42.35828205989543,"c2"), 40], ]],
    [new Building(42.35875606594003,-71.08987122911253,"2"), [[new Corner(-71.09018885591877,42.35912964914011,"c8"), 150], ]],
    [new Building(42.35897079001906,-71.09245698370819,"3"), [[new Corner(-71.09269722032978,42.35929119646584,"c1"), 120], [new Corner(-71.09216044403016,42.35843090129477,"c3"), 180], ]],
    [new Building(42.35950397603377,-71.09100366519826,"4"), [[new Corner(-71.09065157975648,42.358980807740764,"c7"), 170], [new Corner(-71.09115480753738,42.35978733446365,"c5"), 90], ]],
    [new Building(42.35872008178984,-71.09292544212606,"5"), [[new Corner(-71.09262316786787,42.35828205989543,"c2"), 160], [new Building(42.3591423550665,-71.0931599441675,"7"), 140], ]],
    [new Building(42.3591423550665,-71.0931599441675,"7"), [[new Building(42.35872008178984,-71.09292544212606,"5"), 140], [new Corner(-71.09340480740074,42.359386390407565,"c9"), 110], ]],
    [new Building(42.359506270258606,-71.0928314144047,"11"), [[new Corner(-71.09269722032978,42.35929119646584,"c1"), 70], [new Corner(-71.09269722032978,42.35929119646584,"c1"), 70], ]],
    [new Building(42.35964680236113,-71.09199311097103,"10"), [[new Corner(-71.09192601393357,42.35953926546475,"c4"), 40], ]],
    [new Building(42.35998994431118,-71.0907256322184,"8"), [[new Building(42.35950602827745,-71.09042369554986,"6"), 160], [new Corner(-71.09092344561851,42.359861755163315,"c6"), 70], ]],
    [new Building(42.35950602827745,-71.09042369554986,"6"), [[new Corner(-71.09018885591877,42.35912964914011,"c8"), 120], [new Building(42.35998994431118,-71.0907256322184,"8"), 160], ]],
    [new Building(42.35964668137054,-71.09078925154361,"6C"), [[new Corner(-71.09092344561851,42.359861755163315,"c6"), 70], ]],
    [new Building(42.35946081110724,-71.0931734454819,"7A"), [[new Corner(-71.09340480740074,42.359386390407565,"c9"), 50], ]],
    [new Corner(-71.09269722032978,42.35929119646584,"c1"), [[new Corner(-71.09192601393357,42.35953926546475,"c4"), 180], [new Building(42.359506270258606,-71.0928314144047,"11"), 70], [new Building(42.35897079001906,-71.09245698370819,"3"), 120], [new Building(42.359506270258606,-71.0928314144047,"11"), 70], ]],
    [new Corner(-71.09262316786787,42.35828205989543,"c2"), [[new Corner(-71.09216044403016,42.35843090129477,"c3"), 100], [new Building(42.358173197989466,-71.09259483663683,"1"), 40], [new Building(42.35872008178984,-71.09292544212606,"5"), 160], ]],
    [new Corner(-71.09216044403016,42.35843090129477,"c3"), [[new Building(42.35897079001906,-71.09245698370819,"3"), 180], [new Corner(-71.09262316786787,42.35828205989543,"c2"), 100], ]],
    [new Corner(-71.09192601393357,42.35953926546475,"c4"), [[new Corner(-71.09115480753738,42.35978733446365,"c5"), 170], [new Building(42.35964680236113,-71.09199311097103,"10"), 40], [new Corner(-71.09269722032978,42.35929119646584,"c1"), 180], ]],
    [new Corner(-71.09115480753738,42.35978733446365,"c5"), [[new Building(42.35950397603377,-71.09100366519826,"4"), 90], [new Corner(-71.09192601393357,42.35953926546475,"c4"), 170], ]],
    [new Corner(-71.09092344561851,42.359861755163315,"c6"), [[new Building(42.35998994431118,-71.0907256322184,"8"), 70], [new Building(42.35964668137054,-71.09078925154361,"6C"), 70], ]],
    [new Corner(-71.09065157975648,42.358980807740764,"c7"), [[new Corner(-71.09018885591877,42.35912964914011,"c8"), 100], [new Building(42.35950397603377,-71.09100366519826,"4"), 170], ]],
    [new Corner(-71.09018885591877,42.35912964914011,"c8"), [[new Building(42.35875606594003,-71.08987122911253,"2"), 150], [new Corner(-71.09065157975648,42.358980807740764,"c7"), 100], [new Building(42.35950602827745,-71.09042369554986,"6"), 120], ]],
    [new Corner(-71.09340480740074,42.359386390407565,"c9"), [[new Building(42.3591423550665,-71.0931599441675,"7"), 110], [new Building(42.35946081110724,-71.0931734454819,"7A"), 50], ]],
]);



// Helper function to convert degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180) * 1000;
}

function printAdjlist() {
    let a = `[`;

    for (node of adjlist) {

        // console.log(node[0].getLabel())
        // put keys
        if (node[0].getLabel()[0] == "c") {
            a += `[new Corner(${node[0].getLon()},${node[0].getLat()},"${node[0].getLabel()}")`
        }
        else {
            a += `[new Building(${node[0].getLat()},${node[0].getLon()},"${node[0].getLabel()}")`
        }

        // put values
        a += `, [`
        node[1].forEach(arr => {
            if (arr[0].getLabel()[0] == "c") {
                a += `[new Corner(${arr[0].getLon()},${arr[0].getLat()},"${arr[0].getLabel()}"), ${arr[1]}], `
            }
            else {
                a += `[new Building(${arr[0].getLat()},${arr[0].getLon()},"${arr[0].getLabel()}"), ${arr[1]}], `
            }
        })
        a += `]], `
    }
    a += `]`

    console.log(a)
}

function getPixelPosition(lat, lon) {
    // return { x: 20, y: 20 };
    lat = (lat - topLeftLat) * 1000;
    lon = (lon - topLeftLon) * 1000;
    let x_1 = 0;
    let y_1 = 0;
    let x_2 = (botLeftLat - topLeftLat) * 1000;
    let y_2 = (botLeftLon - topLeftLon) * 1000;
    let x_3 = (topRightLat - topLeftLat) * 1000;
    let y_3 = (topRightLon - topLeftLon) * 1000;
    const pixelX = round(
        imgWidth *
        ((lat - x_1) * (y_2 - y_1) + (lon - y_1) * (x_1 - x_2))
        /
        ((x_3 - x_1) * (y_2 - y_1) - (x_2 - x_1) * (y_3 - y_1))
    );
    const pixelY = round(
        imgHeight *
        ((lon - y_1) * (x_3 - x_1) + (lat - x_1) * (y_1 - y_3))
        /
        ((x_3 - x_1) * (y_2 - y_1) - (x_2 - x_1) * (y_3 - y_1))
    );
    return { x: pixelX, y: pixelY };
}



// Example usage:
// Building and coordinates here

const buildingNodes = [
    new Building(42.358173197989466, -71.09259483663683, "1"),
    new Building(42.35875606594003, -71.08987122911253, "2"),
    new Building(42.35897079001906, -71.09245698370819, "3"),
    new Building(42.35950397603377, -71.09100366519826, "4"),
    new Building(42.35872008178984, -71.09292544212606, "5"),
    new Building(42.3591423550665, -71.0931599441675, "7"),
    new Building(42.359506270258606, -71.0928314144047, "11"),
    new Building(42.35964680236113, -71.09199311097103, "10"),
    new Building(42.35998994431118, -71.0907256322184, "8"),
    new Building(42.35950602827745, -71.09042369554986, "6"),
    new Building(42.35964668137054, -71.09078925154361, "6C"),
    new Building(42.35946081110724, -71.0931734454819, "7A")
]

const cornerNodes = [
    new Corner(-71.09269722032978, 42.35929119646584, "c1"),
    new Corner(-71.09262316786787, 42.35828205989543, "c2"),
    new Corner(-71.09216044403016, 42.35843090129477, "c3"),
    new Corner(-71.09192601393357, 42.35953926546475, "c4"),
    new Corner(-71.09115480753738, 42.35978733446365, "c5"),
    new Corner(-71.09092344561851, 42.359861755163315, "c6"),
    new Corner(-71.09065157975648, 42.358980807740764, "c7"),
    new Corner(-71.09018885591877, 42.35912964914011, "c8"),
    new Corner(-71.09340480740074, 42.359386390407565, "c9")
];

// const myBuilding = new Building(10, 20,);
// console.log(myBuilding.getPosition()); // Output: "Building is located at (10, 20)"
// myBuilding.updatePosition(30, 40);
// console.log(myBuilding.getPosition()); // Output: "Building is located at (30, 40)"


function nn(x, y) {
    let target;
    let mindist = Infinity;
    for (thing of buildingNodes) {

        const pix = getPixelPosition(thing.getLat(), thing.getLon());

        const dist = Math.abs(pix.x - x) + Math.abs(pix.y - y);
        console.log(dist);
        if (dist < mindist) {
            target = thing;
            mindist = dist;
        }
    }

    for (thing of cornerNodes) {

        const pix = getPixelPosition(thing.getLat(), thing.getLon());

        const dist = Math.abs(pix.x - x) + Math.abs(pix.y - y);
        console.log(dist);
        if (dist < mindist) {
            target = thing;
            mindist = dist;
        }
    }
    return target;
}

function drawPoint(x, y, label = "") {
    // Add a circle at the center of the image
    svg_d3.append("circle")
        .attr("cx", x)  // Center the circle horizontally
        .attr("cy", y) // Center the circle vertically
        .attr("r", 12)             // Radius of the circle
        .attr("fill", "red");      // Color of the circle
    svg_d3.append("text")
        .attr("x", x)  // Center the circle horizontally
        .attr("y", y) // Center the circle vertically
        .text(label)   // Color of the circle
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        // .attr("font-size", 25)
        .attr("fill", "white")
        .attr("font-family", "Arial, Helvetica, sans-serif");
}
function drawDot(x, y) {
    // Add a circle at the center of the image
    svg_d3.append("circle")
        .attr("cx", x)  // Center the circle horizontally
        .attr("cy", y) // Center the circle vertically
        .attr("r", 4)             // Radius of the circle
        .attr("fill", "black");      // Color of the circle
}
// img.onload = drawPoint(imgWidth/2, imgHeight/2, "");

let clickstatus = false;
let svgX, svgY;

svg_html.onclick = function (e) {
    let svgRect = svg_html.getBoundingClientRect();
    svgX = e.clientX - svgRect.left;
    svgY = e.clientY - svgRect.top;
    svgX = round(svgX);
    svgY = round(svgY);

    // drawPoint(svgX, svgY, "");
    clickqueue.push({ x: svgX, y: svgY });
    console.log(svgX, svgY);

    clickstatus = true;

};

let clickqueue = [];
let inputstatus = "";

document.addEventListener('keydown', function (event) {
    if (event.key == "Escape") {
        clickqueue = [];
        inputstatus = "";
        clickstatus = false;
        return;
    }
    if ((clickstatus) && event.key == "q") {
        const latlon = getLatLon(svgX, svgY);
        cornerNodes.push(new Corner(latlon.lat, latlon.lon))
        inputstatus = "";
        // You can trigger any action here
        clickqueue = [];
        clickstatus = false;
        return;
    }

    if ((clickstatus) && event.key == "Enter") {
        const latlon = getLatLon(svgX, svgY);
        buildingNodes.push(new Building(latlon.lat, latlon.lon, String(inputstatus)))
        inputstatus = "";
        // You can trigger any action here
        clickqueue = [];
        clickstatus = false;
        return;
    }
    if (event.key == "x" && clickqueue.length == 2) {
        nd1 = nn(clickqueue[0].x, clickqueue[0].y);
        nd2 = nn(clickqueue[1].x, clickqueue[1].y);

        console.log(nd1, nd2);

        nd1hello = getPixelPosition(nd1.getLat(), nd1.getLon());
        nd2hello = getPixelPosition(nd2.getLat(), nd2.getLon());

        adjlist.get(nd1).push([nd2, Math.abs(nd1hello.x - nd2hello.x) + Math.abs(nd1hello.y - nd2hello.y)])
        adjlist.get(nd2).push([nd1, Math.abs(nd1hello.x - nd2hello.x) + Math.abs(nd1hello.y - nd2hello.y)])

        clickqueue = [];
        inputstatus = "";
        clickstatus = false;
        return;
    }

    if (event.key == "p" && clickqueue.length == 2) {
        nd1 = nn(clickqueue[0].x, clickqueue[0].y);
        nd2 = nn(clickqueue[1].x, clickqueue[1].y);

        console.log("xs");

        const pathpath = findShortestPath(adjlist, nd1, nd2);

        console.log(pathpath);

        let pathstring = "M "

        for (thing of pathpath) {
            const pixelpos = getPixelPosition(thing.getLat(), thing.getLon());
            pathstring += pixelpos.x;
            pathstring += " ";
            pathstring += pixelpos.y;
            pathstring += " L ";
        }

        pathstring = pathstring.slice(0, -2);


        console.log(pathstring)

        svg_d3.insert("path", "circle").attr("d", pathstring).style("stroke", "red").style("stroke-width", "4").style("fill", "none");

        clickqueue = [];
        clickstatus = false;
    }



    if ((clickstatus)) {
        inputstatus += event.key.toUpperCase();
        console.log(inputstatus);
    }
});

// gpt
function findShortestPath(adjacencyList, startNode, endNode) {
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set(adjacencyList.keys());

    // Initialize distances and previous maps
    adjacencyList.forEach((_, node) => {
        distances.set(node, Infinity);
        previous.set(node, null);
    });
    distances.set(startNode, 0);

    while (unvisited.size > 0) {
        // Get the node with the shortest distance
        const currentNode = [...unvisited].reduce((a, b) =>
            distances.get(a) < distances.get(b) ? a : b
        );

        if (currentNode === endNode) break; // Exit once we've reached the end node

        unvisited.delete(currentNode);

        // Update distances for neighbors
        adjacencyList.get(currentNode).forEach(([neighbor, distance]) => {
            const newDist = distances.get(currentNode) + distance;
            if (newDist < distances.get(neighbor)) {
                distances.set(neighbor, newDist);
                previous.set(neighbor, currentNode);
            }
        });
    }

    // Reconstruct the path
    const path = [];
    let temp = endNode;
    while (temp) {
        path.unshift(temp);
        temp = previous.get(temp);
    }

    return path.length ? path : null; // Return the path or null if no path exists
}
