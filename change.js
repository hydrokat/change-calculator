let args = [];
process.argv.forEach(function (val, index, array) {
  // console.log(index + ': ' + val);
  args.push(val);
});

var denom = [
  { name: 'ONE THOUSAND', val: 1000.00},
  { name: 'FIVE HUNDRED', val: 500.00},
  { name: 'TWO HUNDRED', val: 200.00},
  { name: 'ONE HUNDRED', val: 100.00},
  { name: 'FIFTY', val: 50.00},
  { name: 'TWENTY', val: 20.00},
  { name: 'TEN', val: 10.00},
  { name: 'FIVE', val: 5.00},
  { name: 'ONE', val: 1.00},
  { name: 'BINTING', val: 0.25},
  { name: 'TEN SENTIMOS', val: 0.10},
  { name: 'FIVE SENTIMOS', val: 0.05},
  { name: 'ONE SENTIMO', val: 0.01},
];

let price = args[2];
let cash = args[3];
let cid = [
  ['ONE THOUSAND', 1],
  ['FIVE HUNDRED', 1],
  ['TWO HUNDRED', 2],
  ['ONE HUNDRED', 4],
  ['FIFTY', 2],
  ['TWENTY', 1],
  ['TEN', 5],
  ['FIVE', 1],
  ['ONE', 1],
  ['BINTING',5],
  ['TEN SENTIMOS', 10],
  ['FIVE SENTIMOS', 5],
  ['ONE SENTIMO', 100]
];

if(price == undefined || cash == undefined) {
  console.log("Parameters invalid");
  return false;
}

function checkCashRegister(price, cash, cid) {
  var change = cash - price;

  // Transform CID array into drawer object
  var register = cid.reduce(function(acc, curr) {
    let sCurrency = denom.filter((sc) => {
      return sc.name == curr[0];
    });

    acc.total += curr[1] * sCurrency[0].val;
    acc[curr[0]] = curr[1] * sCurrency[0].val;

    return acc;
  }, {total: 0});

  console.log("Total Cash in drawer", register);

  // Handle exact change
  if (register.total === change) {
    return 'Closed';
  }

  // Handle obvious insufficent funds
  if (register.total < change) {
    return 'Insufficient Funds';
  }

  // Loop through the denomination array
  var change_arr = denom.reduce(function(acc, curr) {
    var value = 0;
    var i = 0;
    // While there is still money of this type in the drawer
    // And while the denomination is larger than the change remaining
    while (register[curr.name] > 0 && change >= curr.val) {
      i += 1;
      change -= curr.val;
      register[curr.name] -= curr.val;
      value += curr.val;

      // Round change to the nearest hundreth deals with precision errors
      change = (Math.round(change * 100) / 100);
    }
    // Add this denomination to the output only if any was used.
    if (value > 0) {
        acc.push([ curr.name, i, value.toFixed(2) ]);
    }
    return acc; // Return the current Change Array
  }, []); // Initial value of empty array for reduce

  // If there are no elements in change_arr or we have leftover change, return
  // the string "Insufficient Funds"
  if (change_arr.length < 1 || change > 0) {
    return "Insufficient Funds";
  }

  // Here is your change, ma'am.
  return change_arr;
}

function checkIdealChange(price, cash, cid) {
  var change = cash - price;

  // Transform CID array into drawer object
  var register = cid.reduce(function(acc, curr) {
    let sCurrency = denom.filter((sc) => {
      return sc.name == curr[0];
    });

    acc.total += curr[1] * sCurrency[0].val;
    acc[curr[0]] = curr[1] * sCurrency[0].val;

    return acc;
  }, {total: 0});

  // Handle exact change
  if (register.total === change) {
    return 'Closed';
  }

  // Handle obvious insufficent funds
  if (register.total < change) {
    return 'Insufficient Funds';
  }

  // Loop through the denomination array
  var change_arr = denom.reduce(function(acc, curr) {
    var value = 0;
    var i = 0;
    // Let's look for the optimal change
    while (change >= curr.val) { //register[curr.name] > 0 &&
      i += 1;
      change -= curr.val;
      register[curr.name] -= curr.val;
      value += curr.val;

      // Round change to the nearest hundreth deals with precision errors
      change = (Math.round(change * 100) / 100);
    }
    // Add this denomination to the output only if any was used.
    if (value > 0) {
        acc.push([ curr.name, i, value.toFixed(2) ]);
    }
    return acc; // Return the current Change Array
  }, []); // Initial value of empty array for reduce

  // If there are no elements in change_arr or we have leftover change, return
  // the string "Insufficient Funds"
  if (change_arr.length < 1 || change > 0) {
    return "Insufficient Funds";
  }

  // Here is your change, ma'am.
  return change_arr;
}

function levelUp(denomination, quantity) {
  let thisDen = denom.filter(function(d) {
    return d['name'] == denomination;
  });

  thisDen = thisDen[0];

  let thisDenIndex = denom.findIndex(function(d) {
    return d['name'] == thisDen['name'];
  });;
  let qty = quantity;

  let next = denom[thisDenIndex - 1];

  let value = thisDen['val'] * quantity;
  let lacking = 0;
  let i = 1;

  while(value <= next['val']) {
    value += thisDen['val'];
    i += 1;
  }

  lacking = i - quantity;

  return {"onHand": thisDen['name'],
          "onHandQty": quantity,
          "next": next['name'],
          "lacking": lacking
        };
}

// test here
let change = checkCashRegister(price, cash, cid);
// console.log("Change breakdown", change);
console.log("");
console.log("=====================Summary=====================");
console.log("Amount to pay:", price);
console.log("Cash:", cash);
console.log("Total change: ", cash - price);
console.log("");
console.log("Breakdown");

change.forEach(function(c) {
  console.log(c[1] + "x " + c[0] + " = " + c[2]);
});

console.log("=================================================");

let idealChange = checkIdealChange(price, cash, cid);

console.log("");
console.log("=====================IDEAL=====================");
console.log("Amount to pay:", price);
console.log("Cash:", cash);
console.log("Total change: ", cash - price);
console.log("");
console.log("Breakdown");

idealChange.forEach(function(c) {
  console.log(c[1] + "x " + c[0] + " = " + c[2]);
});

console.log("=================================================");

let lvlUp = levelUp('ONE', 2);

console.log("You have " + lvlUp.onHandQty + " of " + lvlUp.onHand);
console.log("The next bigger denomination is", lvlUp.next);
console.log("You need " + lvlUp.lacking + " more of " + lvlUp.onHand);
