const leavetrackerdb = require("../utils/firebasedb");
const firestore = require("firebase-admin").firestore;

function emptyLeaveArrayBuilder(month, year) {
  // build an empty array of 31 days for the month if the day is weekend then set the type to weekend
  let emptyLeaveArray = [];
  let daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
  for (let i = 1; i <= daysInMonth; i++) {
    let day = moment(`${year}-${month}-${i}`, "YYYY-MM-DD").format("dddd");
    // console.log({
    //     day,
    //     month,
    //     year,
    //     date: moment(`${year}-${month}-${i}`, "YYYY-MM-DD").format('DD'),
    // });
    if (day == "Saturday" || day == "Sunday") {
      emptyLeaveArray.push({
        day: i.toString(),
        value: 15,
        type: "weekend",
      });
    } else {
      emptyLeaveArray.push({
        day: i.toString(),
        value: 0,
        type: "",
      });
    }
  }
  return emptyLeaveArray;
}

function leaveObjectMatchIdtoDays(leavesArray) {
  //find all the uniuedays in the leavesArray
  let uniqueDays = [];
  leavesArray.forEach((leave) => {
    if (!uniqueDays.includes(leave.day)) {
      uniqueDays.push(leave.day);
    }
  });

  //find all the unique leave ids in the leavesArray for the days in uniqueDays and store them in {day : [leaveids]}
  let leaveIds = [];
  uniqueDays.forEach((day) => {
    let leaveids = [];
    leavesArray.forEach((leave) => {
      if (leave.day == day) {
        leaveids.push(leave.id);
      }
    });
    leaveIds.push({
      day: day,
      leaveids: leaveids,
    });
  });

  let reqArray = [];
  // build from string from
  leaveIds.forEach((leave) => {
    let leaveidString = "";
    leave.leaveids.forEach((leaveid) => {
      leaveidString += leaveid + ",";
    });

    /// remove last chartacter from leaveidString
    leaveidString = leaveidString.slice(0, -1);
    reqArray.push({
      day: leave.day,
      leaveids: leaveidString,
    });
  });
  return reqArray;
}

function leaveObjectConv(leaveObjectData) {
  output = [];
  const startDate = moment(new Date(leaveObjectData.startDate));
  const endDate = moment(new Date(leaveObjectData.endDate));
  const days = endDate.diff(startDate, "days");
  if (startDate.isSame(endDate, "day")) {
    output.push({
      day: startDate.format("DD"),
      type: leaveObjectData.type,
      value: 1,
      id: leaveObjectData.id,
    });
  } else {
    for (let i = 0; i <= days; i++) {
      // check if the day is a weekend
      output.push({
        day: startDate.add(i, "days").format("DD"),
        value: 1,
        type: leaveObjectData.type,
        id: leaveObjectData.id,
      });
    }
  }
  return output;
}

const moment = require("moment");
const getDashboard = async (req, res) => {
  try {
    const month = req.query.month; // 01-12
    const year = req.query.year; // 2020
    let day = req.query.day; //00-31

    let startOftheDay;
    let endOftheDay;
    let leavesOftheDay = [];
    //startDateoftheMonth = start date of the month
    //endDateoftheMont = end date of the month

    const startDateoftheMonth = moment(`${year}-${month}-01`).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    const endDateoftheMonth = moment(`${year}-${month}-01`)
      .endOf("month")
      .format("YYYY-MM-DD HH:mm:ss");

    const leaves = await leavetrackerdb
      .collection("leaves")
      .where(
        "sd",
        ">=",
        firestore.Timestamp.fromMillis(new Date(startDateoftheMonth))
      )
      .where(
        "sd",
        "<=",
        firestore.Timestamp.fromMillis(new Date(endDateoftheMonth))
      )
      .where("orgId", "==", req.user.orgId)
      .where("status", "==", "approved")
      .get();

    leavesArray = [];
    leaves.forEach((leave) => {
      leavesArray.push(
        leaveObjectConv({
          id: leave.id,
          ...leave.data(),
        })
      );
    });

    let leavesArrayObjects = [];
    leavesArray.forEach((leave) => {
      leave.forEach((leaveObject) => {
        leavesArrayObjects.push(leaveObject);
      });
    });

    let ddData = leaveObjectMatchIdtoDays(leavesArrayObjects);

    let emptyLeaveArray = emptyLeaveArrayBuilder(month, year);
    // sort the array by day and delete the valid days from the emptyLeaveArray
    let unSortedArray = [...emptyLeaveArray, ...leavesArrayObjects];
    let sortedArray = unSortedArray.sort((a, b) => {
      return a.day - b.day;
    });
    res.json({
      message: "Dashboard",
      data: {
        sdate: moment(`${year}-${month}-01`).format("DD MMMM YYYY"),
        edate: moment(`${year}-${month}-01`)
          .endOf("month")
          .format("DD MMMM YYYY"),
        days: sortedArray,
        ddData: ddData,
        startOftheDay,
        endOftheDay,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error getting dashboard",
      error: err.message,
    });
  }
};

module.exports = {
  getDashboard,
};
