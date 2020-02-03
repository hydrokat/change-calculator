let args = [];
process.argv.forEach(function (val, index, array) {
  // console.log(index + ': ' + val);
  args.push(val);
});

let denomination = args[2];
let qty = args[3];

let denom = [
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

  while(value < next['val']) {
    value += thisDen['val'];
    lacking += 1;
  }

  return {"onHand": thisDen['name'],
          "onHandQty": quantity,
          "next": next['name'],
          "lacking": lacking
        };
}

let lvlUp = levelUp(denomination, qty);

console.log("You have " + lvlUp.onHandQty + " of " + lvlUp.onHand);
console.log("The next bigger denomination is", lvlUp.next);
console.log("You need " + lvlUp.lacking + " more of " + lvlUp.onHand);
