// =========================================
// HABIT TRACKER
// =========================================


// =========================================
// LOAD SAVED DATA
// =========================================

let habits =
    JSON.parse(localStorage.getItem("habits")) || [];

let habitData =
    JSON.parse(localStorage.getItem("habitData")) || {};


// =========================================
// CURRENT MONTH AND YEAR
// =========================================

const today = new Date();

let currentMonth = today.getMonth();

let currentYear = today.getFullYear();


// =========================================
// EDIT MODE
// =========================================

let editingHabitId = null;


// =========================================
// MONTH NAMES
// =========================================

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


// =========================================
// GET HTML ELEMENTS
// =========================================

const currentMonthElement =
    document.querySelector(".current-month");

const currentYearElement =
    document.querySelector(".current-year");

const previousMonthButton =
    document.querySelector(".previous-month");

const nextMonthButton =
    document.querySelector(".next-month");

const previousYearButton =
    document.querySelector(".previous-year");

const nextYearButton =
    document.querySelector(".next-year");

const habitInput =
    document.querySelector(".habit-input");

const saveHabitButton =
    document.querySelector(".save-habit-button");

const habitList =
    document.querySelector(".habit-list");

const habitTable =
    document.querySelector(".habit-table");

const percentageElement =
    document.querySelector(".percentage");

const dailyPercentages =
    document.querySelector(".daily-percentages");

const treeElement =
    document.querySelector(".tree");

const treeCount =
    document.querySelector(".tree-count");

const canvas =
    document.getElementById("progressGraph");


// =========================================
// GET CURRENT MONTH KEY
// =========================================

function getMonthKey() {

    return `${currentYear}-${currentMonth + 1}`;

}


// =========================================
// GET NUMBER OF DAYS
// =========================================

function getDaysInMonth() {

    return new Date(
        currentYear,
        currentMonth + 1,
        0
    ).getDate();

}


// =========================================
// SAVE DATA
// =========================================

function saveData() {

    localStorage.setItem(
        "habits",
        JSON.stringify(habits)
    );

    localStorage.setItem(
        "habitData",
        JSON.stringify(habitData)
    );

}


// =========================================
// UPDATE MONTH DISPLAY
// =========================================

function updateMonthDisplay() {

    currentMonthElement.textContent =
        `${monthNames[currentMonth]} ${currentYear}`;

    currentYearElement.textContent =
        currentYear;

}


// =========================================
// ADD / UPDATE HABIT
// =========================================

function saveHabit() {

    const name =
        habitInput.value.trim();


    if (name === "") {

        habitInput.focus();

        return;

    }


    // =====================================
    // UPDATE EXISTING HABIT
    // =====================================

    if (editingHabitId !== null) {

        const habit =
            habits.find(
                function (item) {

                    return item.id ===
                        editingHabitId;

                }
            );


        if (habit) {

            habit.name = name;

        }


        editingHabitId = null;

        saveHabitButton.textContent =
            "Add";

    }


    // =====================================
    // ADD NEW HABIT
    // =====================================

    else {

        const newHabit = {

            id: Date.now(),

            name: name

        };


        habits.push(newHabit);

    }


    habitInput.value = "";

    saveData();

    renderHabits();

    renderTracker();

    updateProgress();

    drawGraph();

    habitInput.focus();

}


// =========================================
// ADD BUTTON
// =========================================

saveHabitButton.addEventListener(
    "click",
    saveHabit
);


// =========================================
// ENTER KEY
// =========================================

habitInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            saveHabit();

        }

    }
);


// =========================================
// DISPLAY HABITS
// =========================================

function renderHabits() {

    habitList.innerHTML = "";


    if (habits.length === 0) {

        const message =
            document.createElement("p");

        message.textContent =
            "No habits added yet.";

        message.style.padding =
            "15px";

        message.style.color =
            "#999";

        habitList.appendChild(
            message
        );

        return;

    }


    habits.forEach(
        function (habit) {

            const habitItem =
                document.createElement("div");

            habitItem.classList.add(
                "habit-item"
            );


            // HABIT NAME

            const habitName =
                document.createElement("span");

            habitName.classList.add(
                "habit-name"
            );

            habitName.textContent =
                habit.name;


            // ACTIONS

            const actions =
                document.createElement("div");

            actions.classList.add(
                "habit-actions"
            );


            // EDIT BUTTON

            const editButton =
                document.createElement("button");

            editButton.textContent =
                "✏️";

            editButton.title =
                "Edit habit";


            editButton.addEventListener(
                "click",
                function () {

                    startEditingHabit(
                        habit.id
                    );

                }
            );


            // DELETE BUTTON

            const deleteButton =
                document.createElement("button");

            deleteButton.textContent =
                "🗑️";

            deleteButton.title =
                "Delete habit";


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteHabit(
                        habit.id
                    );

                }
            );


            actions.appendChild(
                editButton
            );

            actions.appendChild(
                deleteButton
            );


            habitItem.appendChild(
                habitName
            );

            habitItem.appendChild(
                actions
            );


            habitList.appendChild(
                habitItem
            );

        }
    );

}


// =========================================
// START EDITING HABIT
// =========================================

function startEditingHabit(id) {

    const habit =
        habits.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!habit) {

        return;

    }


    editingHabitId = id;

    habitInput.value =
        habit.name;

    saveHabitButton.textContent =
        "Update";

    habitInput.focus();

    habitInput.select();

}


// =========================================
// DELETE HABIT
// =========================================

function deleteHabit(id) {

    const habit =
        habits.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!habit) {

        return;

    }


    const shouldDelete =
        confirm(
            `Delete "${habit.name}"?`
        );


    if (!shouldDelete) {

        return;

    }


    habits =
        habits.filter(
            function (item) {

                return item.id !== id;

            }
        );


    // Remove saved completion data
    // for this habit

    Object.keys(habitData).forEach(
        function (monthKey) {

            if (
                habitData[monthKey] &&
                habitData[monthKey][id]
            ) {

                delete habitData[
                    monthKey
                ][id];

            }

        }
    );


    if (editingHabitId === id) {

        editingHabitId = null;

        habitInput.value = "";

        saveHabitButton.textContent =
            "Add";

    }


    saveData();

    renderHabits();

    renderTracker();

    updateProgress();

    drawGraph();

}


// =========================================
// CHECK IF HABIT IS COMPLETED
// =========================================

function isCompleted(
    habitId,
    day
) {

    const monthKey =
        getMonthKey();


    if (!habitData[monthKey]) {

        return false;

    }


    if (!habitData[monthKey][habitId]) {

        return false;

    }


    return (
        habitData[monthKey][habitId][day]
        === true
    );

}


// =========================================
// SAVE CHECKBOX STATUS
// =========================================

function saveHabitStatus(
    habitId,
    day,
    checked
) {

    const monthKey =
        getMonthKey();


    if (!habitData[monthKey]) {

        habitData[monthKey] = {};

    }


    if (!habitData[monthKey][habitId]) {

        habitData[monthKey][habitId] = {};

    }


    habitData[monthKey][habitId][day] =
        checked;


    saveData();

}


// =========================================
// CREATE DAILY TRACKER
// =========================================

function renderTracker() {

    const tableHead =
        habitTable.querySelector(
            "thead tr"
        );

    const tableBody =
        habitTable.querySelector(
            "tbody"
        );


    tableHead.innerHTML = "";

    tableBody.innerHTML = "";


    // =====================================
    // HABIT HEADER
    // =====================================

    const habitHeader =
        document.createElement("th");

    habitHeader.textContent =
        "Habit";

    tableHead.appendChild(
        habitHeader
    );


    const days =
        getDaysInMonth();


    // =====================================
    // CREATE DAY HEADERS
    // =====================================

    for (
        let day = 1;
        day <= days;
        day++
    ) {

        const date =
            new Date(
                currentYear,
                currentMonth,
                day
            );


        const weekday =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "long"
                }
            );


        const th =
            document.createElement("th");


        th.innerHTML = `
            <div>${weekday}</div>
            <div>${day}</div>
        `;


        tableHead.appendChild(
            th
        );

    }


    // =====================================
    // CREATE HABIT ROWS
    // =====================================

    habits.forEach(
        function (habit) {

            const row =
                document.createElement("tr");


            const nameCell =
                document.createElement("td");


            nameCell.textContent =
                habit.name;


            row.appendChild(
                nameCell
            );


            // CREATE CHECKBOX
            // FOR EACH DAY

            for (
                let day = 1;
                day <= days;
                day++
            ) {

                const cell =
                    document.createElement("td");

                cell.dataset.day = day;


                const checkbox =
                    document.createElement(
                        "input"
                    );


                checkbox.type =
                    "checkbox";


                checkbox.checked =
                    isCompleted(
                        habit.id,
                        day
                    );


                checkbox.addEventListener(
                    "change",
                    function () {

                        saveHabitStatus(
                            habit.id,
                            day,
                            checkbox.checked
                        );


                        updateProgress();

                        drawGraph();

                    }
                );


                cell.appendChild(
                    checkbox
                );


                row.appendChild(
                    cell
                );

            }


            tableBody.appendChild(
                row
            );

        }
    );

}


// =========================================
// GET DAILY COMPLETION PERCENTAGE
// =========================================

function getDailyPercentage(day) {

    if (habits.length === 0) {

        return 0;

    }


    let completed = 0;


    habits.forEach(
        function (habit) {

            if (
                isCompleted(
                    habit.id,
                    day
                )
            ) {

                completed++;

            }

        }
    );


    return Math.round(
        (completed / habits.length) * 100
    );

}


// =========================================
// GET NUMBER OF COMPLETED HABITS
// =========================================

function getCompletedHabits(day) {

    let completed = 0;


    habits.forEach(
        function (habit) {

            if (
                isCompleted(
                    habit.id,
                    day
                )
            ) {

                completed++;

            }

        }
    );


    return completed;

}


// =========================================
// GET CHERRY TREE STAGE
// =========================================

function getTreeStage(day) {

    if (habits.length === 0) {

        return 0;

    }


    const completed =
        getCompletedHabits(day);


    const percentage =
        (completed / habits.length) * 100;


    // No habits completed

    if (percentage === 0) {

        return 0;

    }


    // Small tree

    if (percentage <= 25) {

        return 1;

    }


    // Growing tree

    if (percentage <= 50) {

        return 2;

    }


    // Some blossoms

    if (percentage <= 75) {

        return 3;

    }


    // Almost full

    if (percentage < 100) {

        return 4;

    }


    // Fully bloomed

    return 5;

}


// =========================================
// CHERRY BLOSSOM TREE SVG
// =========================================

function createCherryTree(stage) {
    const growth = Math.max(0, Math.min(5, Number(stage) || 0));
    if (growth === 0) return `<svg viewBox="0 0 420 420" class="tree-stage" role="img" aria-label="A quiet garden patch ready for a cherry blossom tree"><defs><linearGradient id="earth" x2="0" y2="1"><stop stop-color="#b88a72"/><stop offset="1" stop-color="#775341"/></linearGradient></defs><ellipse cx="210" cy="367" rx="130" ry="18" fill="#9cad84" opacity=".25"/><path d="M100 367 Q210 344 320 367 Q210 390 100 367Z" fill="url(#earth)"/><path d="M125 364q-13-14-22-6m192 6q13-14 22-6" fill="none" stroke="#81966f" stroke-width="5" stroke-linecap="round"/></svg>`;
    if (growth === 1) return `<svg viewBox="0 0 420 420" class="tree-stage" role="img" aria-label="A tiny cherry tree sprout"><ellipse cx="210" cy="367" rx="130" ry="18" fill="#9cad84" opacity=".25"/><path d="M210 367 Q207 334 211 303" fill="none" stroke="#718a59" stroke-width="9" stroke-linecap="round"/><path d="M210 337 Q163 296 137 319 Q162 359 210 344Z" fill="#8eaa72"/><path d="M211 322 Q252 279 283 300 Q263 340 211 333Z" fill="#a6bd83"/><path d="M210 367Q190 373 180 370M210 367q20 7 31 2" stroke="#8b654c" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;

    // Natural branching silhouette with a broad, dense sakura canopy.
    const branchPaths = [
      'M210 365 C199 319 218 276 207 231 C198 185 220 133 211 83',
      'M207 264 C170 235 140 206 106 164 C91 146 76 133 57 125',
      'M211 244 C251 213 283 183 315 143 C333 120 350 105 371 94',
      'M207 218 C178 190 163 156 151 118 C144 96 131 79 114 63',
      'M214 202 C246 171 260 137 271 101 C278 79 294 60 311 48',
      'M202 302 C164 281 127 266 91 244 C72 232 53 220 37 202',
      'M216 295 C255 272 294 252 331 225 C351 210 372 195 389 176',
      'M209 168 C190 144 187 117 186 89',
      'M216 163 C238 140 244 112 246 82',
      'M170 235 C143 226 122 224 98 221',
      'M277 183 C302 172 322 165 345 151'
    ];
    const branchSvg = branchPaths.map((d,i)=>`<path d="${d}" fill="none" stroke="${i===0?'url(#bark)':'#65483f'}" stroke-width="${i===0?22:(i<4?11:7)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#b68d78" stroke-width="${i===0?3:1.6}" opacity=".35" stroke-linecap="round"/>`).join('');
    const cloudShapes = [
      [83,130,67,53],[137,91,74,61],[207,70,78,61],[282,75,76,62],[351,119,66,54],
      [51,195,58,48],[118,179,77,65],[198,154,87,72],[289,158,86,70],[367,190,60,49],
      [82,252,66,48],[164,245,82,59],[254,246,88,64],[340,253,68,51],
      [137,301,65,43],[224,301,84,53],[308,300,68,45]
    ];
    const cloud = cloudShapes.map(([x,y,rx,ry],i)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${['#e98eac','#f2a8bf','#f7bfd0','#dc789a','#f4b2c6'][i%5]}" opacity="${growth===2?.16:growth===3?.52:growth===4?.82:.98}"/>`).join('');
    // Deterministic blossom clusters: layered petals, warm centres and subtle highlights.
    let blossoms='';
    const points=[];
    for(let row=0;row<8;row++){
      const y=67+row*31;
      const span= row<2 ? 150 : row<5 ? 190 : 145;
      const count= row<2 ? 8 : 10;
      for(let col=0;col<count;col++){
        const x=210-span+(2*span*col/(count-1)) + ((row%2)*7);
        const wave=Math.sin((col+1)*2.17+row)*9;
        const yy=y+wave;
        const edge=Math.abs(x-210)/210;
        if((row<2 && edge>.78) || (row>5 && edge>.72)) continue;
        points.push([x,yy,(col+row)%4]);
      }
    }
    points.forEach(([x,y,v],i)=>{
      const opacity=growth===2?.05:growth===3?.48:growth===4?.8:1;
      const s= v===0?1.15:1;
      blossoms += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s})" opacity="${opacity}">
        <g fill="${['#ffeaf0','#ffdce7','#f8c0d2','#f3a9c1','#fff1f4'][i%5]}">
          <ellipse cx="0" cy="-5.1" rx="3.7" ry="5.2"/><ellipse cx="4.9" cy="-1.6" rx="3.7" ry="5.2" transform="rotate(72 4.9 -1.6)"/><ellipse cx="3" cy="4.2" rx="3.7" ry="5.2" transform="rotate(144 3 4.2)"/><ellipse cx="-3" cy="4.2" rx="3.7" ry="5.2" transform="rotate(216 -3 4.2)"/><ellipse cx="-4.9" cy="-1.6" rx="3.7" ry="5.2" transform="rotate(288 -4.9 -1.6)"/>
        </g><circle r="2.1" fill="#d58b62"/><circle cx="-.7" cy="-.7" r=".8" fill="#fff9e8"/>
      </g>`;
    });
    const twigs = `<g fill="none" stroke="#795747" stroke-width="4" stroke-linecap="round"><path d="M104 164q-20-21-28-44m238 28q28-27 36-49M151 119q-9-22-7-39m128 22q17-24 16-43M90 244q-24-7-38-25m280 9q28-12 44-31"/></g>`;
    return `<svg viewBox="0 0 420 420" class="tree-stage tree-stage-${growth}" role="img" aria-label="A ${growth===5?'fully bloomed':growth===4?'almost fully bloomed':'growing'} cherry blossom tree">
      <defs><linearGradient id="bark" x1="0" x2="1"><stop stop-color="#49352f"/><stop offset=".42" stop-color="#916b57"/><stop offset=".7" stop-color="#65483d"/><stop offset="1" stop-color="#392b28"/></linearGradient><radialGradient id="ground"><stop stop-color="#b7c89b"/><stop offset="1" stop-color="#f8edf0" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="210" cy="370" rx="145" ry="30" fill="url(#ground)"/><path d="M210 365Q194 379 178 375m32-10q17 14 34 10" fill="none" stroke="#72503c" stroke-width="5" stroke-linecap="round"/>
      ${branchSvg}${twigs}${cloud}${blossoms}
      <g fill="#fff8fa" opacity="${growth===5?'.8':'.22'}"><circle cx="112" cy="121" r="3"/><circle cx="174" cy="77" r="3"/><circle cx="246" cy="93" r="3"/><circle cx="323" cy="126" r="3"/><circle cx="77" cy="196" r="3"/><circle cx="270" cy="187" r="3"/><circle cx="345" cy="237" r="3"/><circle cx="184" cy="286" r="3"/></g>
    </svg>`;
}

// =========================================
// RENDER DAILY CHERRY TREES
// =========================================

function renderDailyTrees() {

    dailyPercentages.innerHTML = "";


    const days =
        getDaysInMonth();


    for (
        let day = 1;
        day <= days;
        day++
    ) {

        // Create box

        const treeBox =
            document.createElement("div");


        treeBox.classList.add(
            "daily-tree"
        );


        // Create tree area

        const treeIcon =
            document.createElement("div");


        treeIcon.classList.add(
            "daily-tree-icon"
        );


        // Get stage

        const stage =
            getTreeStage(day);


        // Add tree

        treeIcon.innerHTML =
            createCherryTree(stage);


        // Day number

        const dayText =
            document.createElement("div");


        dayText.classList.add(
            "daily-tree-day"
        );


        dayText.textContent =
            day;


        // Add everything

        treeBox.appendChild(
            treeIcon
        );

        treeBox.appendChild(
            dayText
        );


        dailyPercentages.appendChild(
            treeBox
        );

    }

}


// =========================================
// UPDATE OVERALL PROGRESS
// =========================================

function updateProgress() {

    const days =
        getDaysInMonth();


    const totalPossible =
        habits.length * days;


    let totalCompleted = 0;


    habits.forEach(
        function (habit) {

            for (
                let day = 1;
                day <= days;
                day++
            ) {

                if (
                    isCompleted(
                        habit.id,
                        day
                    )
                ) {

                    totalCompleted++;

                }

            }

        }
    );


    let percentage = 0;


    if (totalPossible > 0) {

        percentage =
            Math.round(
                (totalCompleted /
                    totalPossible) * 100
            );

    }


    // Overall percentage

    percentageElement.textContent =
        `${percentage}%`;


    // Daily cherry trees

    renderDailyTrees();


    // Main tree

    updateMainTree(percentage);

}


// =========================================
// MAIN MONTH TREE
// =========================================

function updateMainTree(percentage) {

    let stage = 0;
    if (percentage > 0 && percentage <= 25) stage = 1;
    else if (percentage <= 50 && percentage > 25) stage = 2;
    else if (percentage <= 75 && percentage > 50) stage = 3;
    else if (percentage < 100 && percentage > 75) stage = 4;
    else if (percentage === 100) stage = 5;

    treeElement.innerHTML = createCherryTree(stage);

    const labels = [
        "A fresh start",
        "A little sprout is growing",
        "Your tree is growing",
        "Cherry blossoms are appearing",
        "Almost in full bloom",
        "Your cherry blossom tree is in full bloom!"
    ];
    treeCount.textContent = labels[stage];
}


// =========================================
// PREVIOUS MONTH
// =========================================

previousMonthButton.addEventListener(
    "click",
    function () {

        currentMonth--;


        if (currentMonth < 0) {

            currentMonth = 11;

            currentYear--;

        }


        updateMonthDisplay();

        renderTracker();

        updateProgress();

        drawGraph();

    }
);


// =========================================
// NEXT MONTH
// =========================================

nextMonthButton.addEventListener(
    "click",
    function () {

        currentMonth++;


        if (currentMonth > 11) {

            currentMonth = 0;

            currentYear++;

        }


        updateMonthDisplay();

        renderTracker();

        updateProgress();

        drawGraph();

    }
);


// =========================================
// PREVIOUS YEAR
// =========================================

previousYearButton.addEventListener(
    "click",
    function () {

        currentYear--;


        updateMonthDisplay();

        renderTracker();

        updateProgress();

        drawGraph();

    }
);


// =========================================
// NEXT YEAR
// =========================================

nextYearButton.addEventListener(
    "click",
    function () {

        currentYear++;


        updateMonthDisplay();

        renderTracker();

        updateProgress();

        drawGraph();

    }
);


// =========================================
// DRAW PROGRESS GRAPH
// =========================================

function drawGraph() {

    if (!canvas) {

        return;

    }


    const ctx =
        canvas.getContext("2d");


    const width =
        canvas.clientWidth;


    const height =
        canvas.clientHeight;


    if (
        width <= 0 ||
        height <= 0
    ) {

        return;

    }


    canvas.width =
        width;

    canvas.height =
        height;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const left = 40;

    const right = 15;

    const top = 15;

    const bottom = 30;


    const graphWidth =
        width - left - right;


    const graphHeight =
        height - top - bottom;


    // =====================================
    // GRID LINES
    // =====================================

    ctx.strokeStyle =
        "#f0dce6";

    ctx.lineWidth = 1;


    for (
        let value = 0;
        value <= 100;
        value += 25
    ) {

        const y =
            top +
            graphHeight -
            (value / 100) *
            graphHeight;


        ctx.beginPath();

        ctx.moveTo(
            left,
            y
        );

        ctx.lineTo(
            width - right,
            y
        );

        ctx.stroke();


        ctx.fillStyle =
            "#999";

        ctx.font =
            "11px Arial";

        ctx.textAlign =
            "right";


        ctx.fillText(
            `${value}%`,
            left - 7,
            y + 4
        );

    }


    // =====================================
    // NO HABITS
    // =====================================

    if (habits.length === 0) {

        ctx.fillStyle =
            "#aaa";

        ctx.font =
            "15px Arial";

        ctx.textAlign =
            "center";


        ctx.fillText(
            "Add habits to see your progress",
            width / 2,
            height / 2
        );

        return;

    }


    // =====================================
    // GET DAILY VALUES
    // =====================================

    const days =
        getDaysInMonth();


    const values = [];


    for (
        let day = 1;
        day <= days;
        day++
    ) {

        values.push(
            getDailyPercentage(day)
        );

    }


    // =====================================
    // DRAW LINE
    // =====================================

    ctx.beginPath();


    values.forEach(
        function (value, index) {

            const x =
                left +
                (index / (days - 1)) *
                graphWidth;


            const y =
                top +
                graphHeight -
                (value / 100) *
                graphHeight;


            if (index === 0) {

                ctx.moveTo(
                    x,
                    y
                );

            }

            else {

                ctx.lineTo(
                    x,
                    y
                );

            }

        }
    );


    ctx.strokeStyle =
        "#d86b9d";

    ctx.lineWidth = 3;

    ctx.stroke();


    // =====================================
    // DRAW POINTS
    // =====================================

    values.forEach(
        function (value, index) {

            const x =
                left +
                (index / (days - 1)) *
                graphWidth;


            const y =
                top +
                graphHeight -
                (value / 100) *
                graphHeight;


            ctx.beginPath();


            ctx.arc(
                x,
                y,
                3,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "#d86b9d";

            ctx.fill();

        }
    );


    // =====================================
    // DAY NUMBERS
    // =====================================

    ctx.fillStyle =
        "#999";

    ctx.font =
        "10px Arial";

    ctx.textAlign =
        "center";


    values.forEach(
        function (value, index) {

            const day =
                index + 1;


            if (
                day === 1 ||
                day % 5 === 0 ||
                day === days
            ) {

                const x =
                    left +
                    (index / (days - 1)) *
                    graphWidth;


                ctx.fillText(
                    day,
                    x,
                    height - 8
                );

            }

        }
    );

}


// =========================================
// WINDOW RESIZE
// =========================================

window.addEventListener(
    "resize",
    function () {

        drawGraph();

    }
);


// =========================================
// INITIAL LOAD
// =========================================

updateMonthDisplay();

renderHabits();

renderTracker();

updateProgress();

drawGraph();

// Soft falling cherry-blossom petals in the page background.
(function createFallingPetals() {
    const layer = document.querySelector('.petal-layer');
    if (!layer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const count = window.innerWidth < 600 ? 12 : 22;
    for (let i = 0; i < count; i++) {
        const petal = document.createElement('span');
        petal.className = 'falling-petal';
        petal.style.left = `${Math.random() * 100}%`;
        petal.style.animationDuration = `${11 + Math.random() * 13}s`;
        petal.style.animationDelay = `${-Math.random() * 22}s`;
        petal.style.opacity = `${0.35 + Math.random() * 0.5}`;
        petal.style.transform = `scale(${0.65 + Math.random() * 0.8})`;
        layer.appendChild(petal);
    }
})();


// =========================================
// SAKURA GARDEN EXPERIENCE ENHANCEMENTS
// =========================================
(function enhanceGardenExperience(){
  const layer=document.querySelector('.petal-layer');
  if(layer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    for(let i=0;i<22;i++){
      const petal=document.createElement('span');
      petal.className='petal';
      petal.style.left=(Math.random()*100)+'%';
      petal.style.animationDuration=(12+Math.random()*17)+'s';
      petal.style.animationDelay=(-Math.random()*25)+'s';
      petal.style.opacity=(.28+Math.random()*.48).toFixed(2);
      petal.style.transform='scale('+(0.55+Math.random()*.75).toFixed(2)+')';
      layer.appendChild(petal);
    }
  }
  const menu=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.site-nav');
  if(menu && nav){menu.addEventListener('click',()=>{nav.classList.toggle('open');menu.setAttribute('aria-expanded',nav.classList.contains('open')?'true':'false');});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));}
  const updateLabels=()=>{
    const monthText=document.querySelector('.current-month')?.textContent||'';
    const match=monthText.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/);
    if(match){const count=new Date(Number(match[2]),new Date(Date.parse(match[1]+' 1, 2000')).getMonth()+1,0).getDate();const el=document.querySelector('.days-in-month');if(el)el.textContent=count+' days';}
    const p=parseInt(document.querySelector('.percentage')?.textContent||'0',10)||0;
    const label=p===0?'Seedling':p<=25?'New sprout':p<=50?'Growing tree':p<=75?'Blossoming':'Full bloom';
    const milestone=document.querySelector('.tree-milestone');if(milestone)milestone.textContent=label;
    const fill=document.querySelector('.tree-progress-fill');if(fill)fill.style.width=p+'%';
    const growth=document.querySelector('.tree-growth-label');if(growth)growth.textContent=p+'% nurtured';
    const ring=document.querySelector('.stat-ring');if(ring)ring.style.background=`conic-gradient(#bd4b78 ${p*3.6}deg,#fff8fa 0deg)`;
  };
  const observer=new MutationObserver(updateLabels);
  const month=document.querySelector('.current-month');const percentage=document.querySelector('.percentage');
  if(month)observer.observe(month,{childList:true,subtree:true,characterData:true});
  if(percentage)observer.observe(percentage,{childList:true,subtree:true,characterData:true});
  updateLabels();
})();
