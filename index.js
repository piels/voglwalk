var data = {
  sites: [
    {
      name: 'Braves',
      city: 'Boston',
      latitude: 42.353,
      longitude: -71.119
    },
    {
      name: 'Ebbets',
      city: 'Brooklyn',
      latitude: 40.665,
      longitude: -73.958056
    },
    {
      name: 'Wrigley',
      city: 'Chicago',
      latitude: 41.948056,
      longitude: -87.655556
    },
    {
      name: 'Polo Grounds',
      city: 'New York',
      latitude: 40.830833,
      longitude: -73.9375
    },
    {
      name: 'City',
      city: 'Green Bay',
      latitude: 44.5075,
      longitude: -87.9925
    },
    {
      name: 'Universal',
      city: 'Portsmouth',
      latitude: 38.728611,
      longitude: -82.978333
    },
    {
      name: 'Thompson',
      city: 'Staten Island',
      latitude: 40.6227,
      longitude: -74.0733
    }
  ]
};



data.sites.forEach(site => {
  const rect = latLonTo3d(site);
  site.x = rect.x;
  site.y = rect.y;
  site.z = rect.z;
});

var H = [];
var edge = data.sites.slice(0, 2); // how do we know the first two sites are a valid edge?
var Q = [edge];
var edgesDone = new Map();

while (100 > Q.length && Q.length > 0) {
	console.log(Q.length);
	edge = Q.pop();
	let c = null;
	let theta = 7;
	let edgename = edge[0].city + '-' + edge[1].city;
  
	if (edgesDone.get(edgename)) {
		// console.log('skipping');
		continue;
	}
	console.log(edgename);
	let a = edge[0];
	let b = edge[1];

	let abv = [b.x - a.x, b.y - a.y, b.z - a.z];
	let ku = normalize(abv);
	let oav = [a.x, a.y, a.z];
	let ju = normalize(cross(abv, oav));
	let iu = cross(ju, ku);
	// console.log(iu,ju,ku);
	for (const c0 of data.sites) {
		if (c0 == a || c0 == b) {
			continue;
		}
		let acv = [c0.x - a.x, c0.y - a.y, c0.z - a.z];
		let acu = normalize(acv);
		let theta0 = Math.atan2(dot(acu,ju),dot(acu,iu));
    if (theta0 < 0) { theta0 += 2*Math.PI; }
		// console.log(c.city);
		// console.log(theta);
		let label = c0.city+" "+theta0;

		if (theta0 < theta) {
			c = c0;
			theta = theta0;
			console.log("keep "+label);
		} else {
		  console.log("skip "+label);
		}
	}
	H.push([a, b, c]);
	Q.push([a, c], [c, b]);
	// Q.push([b, c], [c, a]);
	edgesDone.set(a.city + '-' + b.city, true);
	edgesDone.set(b.city + '-' + c.city, true);
	edgesDone.set(c.city + '-' + a.city, true);
} 

/**
for (i = 0; i < data.sites.length; i++) {
	for (j = 0; j < data.sites.length; j++) {
		if (i == j) {
			continue;
		}
		let a = data.sites[i];
		let b = data.sites[j];
		// console.log(a.city + '-' + b.city);
		let theta = 7;
		let abv = [b.x - a.x, b.y - a.y, b.z - a.z];
		let ku = normalize(abv);
		let oav = [a.x, a.y, a.z];
		let ju = normalize(cross(abv, oav));
		let iu = cross(ju, ku);

		for (k = 0; k < data.sites.length; k++) {
			if (i == k || j == k) {
				continue;
			}
			let c0 = data.sites[k];
			let acv = [c0.x - a.x, c0.y - a.y, c0.z - a.z];
			let acu = normalize(acv);
			let theta0 = Math.atan2(dot(acu, ju), dot(acu, iu));
      if (theta0 < 0) {theta0 += 2*Math.PI;}
			// console.log(c.city);
			// console.log(theta);
			let label = c0.city + ' ' + theta0;
			if (theta0 < theta) {
				c = c0;
				theta = theta0;
				// console.log('  keep ' + label);
			} else {
				// console.log('  skip ' + label);
			}
		}
		H.push([a, b, c]);
		console.log('  ' + a.city + '-' + b.city + '-' + c.city);
	}
}

 */

console.log(H.length);
for (const tri of H) {
  console.log(tri[0].city+"-"+tri[1].city+"-"+tri[2].city);

} 

//console.log(H);
//console.log(edgesDone);
console.log('done');

/**
 *
 *
 *  Ensure: H = Convex hull of point-set P
    Require: point-set P
    H = {}
    (p1,p2) = HullEdge(P)
    Q = {(p1,p2)}
    while Q != {} do
        (p1,p2) = Q.pop()
        if notProcessed((p1,p2)) then
            p3 = triangleVertexWithAllPointsToTheLeft(p1,p2)
            H = H UNION {(p1,p2,p3)}
            Q = Q UNION {(p2,p3),(p3,p1)}
            markProcessedEdge((p1,p2))
        end if
    end while
 *
 *
 */

function latLonTo3d(site) {
  const x =
    Math.cos((site.longitude * Math.PI) / 180) *
    Math.cos((site.latitude * Math.PI) / 180);
  const y =
    Math.sin((site.longitude * Math.PI) / 180) *
    Math.cos((site.latitude * Math.PI) / 180);
  const z = Math.sin((site.latitude * Math.PI) / 180);
  return { x, y, z };
}

function normalize(vector) {
  let hyp = Math.hypot(...vector);
  let n = vector.map(x => x / hyp);
  return n;
}

function cross(a, b) {
  let c = [];
  c[0] = a[1] * b[2] - a[2] * b[1];
  c[1] = a[2] * b[0] - a[0] * b[2];
  c[2] = a[0] * b[1] - a[1] * b[0];
  return c;
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}