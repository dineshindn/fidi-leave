// startDate 01-10-2022
// endDate 05-10-2022

let startDate = new Date('2022-10-11');
let endDate = new Date('2022-10-13');

// format date to yyyy-mm-dd
let start = "2022-10-19";
let end = "2022-10-20";

function getDates(start, end) {
    let startDate = new Date(start);
    let endDate = new Date(end);
    let dates = [],
        currentDate = startDate,
        addDays = function(days) {
            let date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
    while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 1);
    }
    // return formatted dates array yyyy-mm-dd e.g. 2022-10-01
    return dates.map((date)=>date.toISOString().split('T')[0]);
}
 let dates = getDates(start, end); // format dates array to yyyy-mm-dd
 console.log("the calculated dates are",dates);
/**
 * [a, b] => [[a],[b],[a,b]]
 */
function powerset(arr) {
  return arr.reduce((a, v) => a.concat(a.map(r => [v].concat(r))), [[]]).filter((item)=>item.length>0).map((item)=>item.join(','));
}

let result = powerset(dates)
console.log("powerset days are",result);

let testStartDate = "2022-10-17";
let testEndDate = "2022-10-18";


let theBool = (result.includes(`${testStartDate}`) || result.includes(`${testEndDate}`)) || result.includes(`${testStartDate},${testEndDate}`);
console.log(theBool);
console.log(powerset(dates).length);