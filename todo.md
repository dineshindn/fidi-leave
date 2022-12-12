# Unable to get leaves requests between two dates.

## the main blocker according to me to implement a solution is firestore.


- we can't use the where clause on firestore to get documents on two keys at once.
- previous solution is to get all the leave requests greater than the start date.
- but that didn't work on edge case.


# solution two to the problem is to use powersets of the dates.

- we can get all the dates between the start and end date.
    ```js
    const getDates = (startDate, endDate) => {
        const dates = [];
        const currDate = moment(startDate).startOf('day');
        const lastDate = moment(endDate).startOf('day');
        while (currDate.add(1, 'days').diff(lastDate) < 0) {
            dates.push(currDate.clone().toDate());
        }
        return dates;
    };
    ```
- using all the dates we can get all the powersets of the dates.
    ```js
    const getPowerSet = (dates) => {
        const powerSet = [];
        const length = dates.length;
        for (let i = 0; i < (1 << length); i++) {
            const subset = [];
            for (let j = 0; j < length; j++) {
                if ((i & (1 << j)) > 0) {
                    subset.push(dates[j]);
                }
            }
            powerSet.push(subset);
        }
        return powerSet;
    };
    ```
- now we push this power set as array of dates to the firestore with key name dates.
- now we can query the firestore with the start and end date and get all the leaves requests between the two dates.
  
  ```js
    const leaves = await db.collection('leaves').where('dates', 'array-contains', `${startDate},${endDate}`).get();
    ```

- this solution helps us to get all the leaves requests between the two dates.
- helps to find a leave request in certain date range.
- check whether a leave request is overlapping with another leave request.


# Dynamic Leave Allowance and policy

## Leave types for jobs in india

[LeaveTypes and their definitions](https://www.greythr.com/leave-management/leave-types/#types-of-leaves)

- Privilege Leave (PL) or Earned Leave (EL)
- Casual Leave (CL)
- Sick Leave (SL)
- Maternity Leave (ML)
- Compensatory Off (Comp-off)
- Marriage Leave
- Paternity Leave
- Bereavement Leave
- Loss of Pay (LOP) / Leave Without Pay (LWP)
 ```js
    leaveTypes : [
        {
            "label": "Privilege Leave (PL) or Earned Leave (EL)",
            "value": "PL||EL",
            "description":"
                a privilege leave is a paid leave that is given to an employee for a specific purpose"
        },
        {
            "label": "Casual Leave (CL)",
            "value": "CL",
            "description":"
                a casual leave is a paid leave that is given to an employee for a specific purpose"
        },
        {
            "label": "Sick Leave (SL)",
            "value": "SL",
            "description":"
                leave given due to sickness"
        },
        {
            "label": "Maternity Leave (ML)",
            "value": "MATL",
            "description":" Maternity Benefit Act of 1961 requires that employers have to provide 26 weeks of paid leave to any woman who has worked for at least 80 days in the 12 months preceding the expected delivery date. "

        },
        {
            "label": "Compensatory Off (Comp-off)",
            "value": "CO",
        },
        {
            "label": "Marriage Leave",
            "value": "MARL",
            "description": "Some companies provide a special leave for employees getting married called Marriage Leave."
        },
        {
            "label": "Paternity Leave",
            "value": "PAT",
            "description": "Paternity Leave is a special leave that is given to fathers to take care of their newborn child."
        },
        {
            "label": "Bereavement Leave",
            "value": "BERL",
            "description": "Bereavement Leave is a special leave that is given to employees to attend the funeral of a family member."
        },
        {
            "label": "Loss of Pay (LOP) / Leave Without Pay (LWP)",
            "value": "LOP||LWP",
            "description": "Loss of Pay (LOP) / Leave Without Pay (LWP) is a special leave that is given to employees to attend the funeral of a family member."
        },
        {
            "label": "Other",// for custom leave types
            "value": "OTHER",// for custom leave value
            "description": "Other leave types"// for custom leave description
        }
    ]
 ```

policy is a json object which contains the leave allowance for each employee.

```js
const policy = {
    startMonth: 4,
    endMonth: 3,
    name: 'Fidisys Leave Policy',
    allowances:[{
        name:"causal",
        amount: 6,
        remaining: 6,
        used: 0,
        type: "CL", // leaveType
        maxLimit: true,// if this is false dont check for max limit on leave object.
        maxLimitAmount: 3,// max limit false dont take this value.

    },
    {
        name:"sick Leave",
        amount: 6,
        remaining: 6,
        used: 0,
        type: "SL", // leaveType
        maxLimit: true,// if this is false dont check for max limit on leave object.
        maxLimitAmount: 3,

    },
    {
        name:"General Leave",
        amount: 12,
        remaining: 12,
        used: 0,
        type: "PL||EL", // leaveType
        maxLimit: true,// if this is false dont check for max limit on leave object.
        maxLimitAmount: 3,
    }]
};
```
## leave types endpoints done

- initially number of default leave types are 9. they are assigned to the org during its creation.
- give a way to add custom leave types to the org. [done]
- edit custom leave types. [done]
- delete custom leave types. [done]

## leave policy endpoints done

- create leave policy
- update leave policy
- delete leave policy
- get leave policy for organization

## leave allowance endpoints done

- create leave allowance
  - add leave allowance to the policy and add it all users [pending]
- read leave allowance
- update leave allowance
  - update leave allowance for all the users [pending]
- delete leave allowance
  - remove leave allowance for all the users [pending]

## some other implementations pending next week 

- ifre using that policy.
- leaveObject validation function allowance is updated for a policy.update the allowance for all the employees who a.
- format conversions needs to be implemented
- need to research on carry forward of leaves implementation.
- need to work on autocredit leave balance depending on the leave allowance credit type.  monthly, quarterly, half yearly, yearly.
- param merging to build better api queries.

## FEED BACK FROM 21-11-2022 meet
- change the label names in leave policy create popup.
- move add employee button to employee list.
- change admin portal to leave requests.
- add dynamic leavetypes under dropdown.
- add normal sign in and sign up.
- dropdown search organization by name and select while login into application.
- talk about open source situation of the project.
- change label names in user dashboard allowances
- make reason as mandatory field in leave request with ui validation. add disable icon for submit.
- include dates in leaverequest list.
- merge leave request summary and leave request list.
- notifications for leave request.
- remove logout button from unable to login page.
- update the routes [UI].
- add husky and lint-staged to the project. [Backend]
- move repos to fidisys org. [P1]
  - leavetracker-ui
  - leavetracker-backend
  - leavetracker-landing
- readme for each repo. [P1]
- remove .env from codebase. [P1]
- handling issues and pull requests. [P1]

## landing page inputs
- Features , pricing, help
- sign in, sign up
- contact.