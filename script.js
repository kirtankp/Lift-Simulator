
const lifts = []; // Array to store lift states
const floorHeight = 100; // Height of each floor in pixels
const liftSpeed = 2000; // Speed of lift movement in milliseconds

//this function is called when the form is submitted, when the submit button is pressed
const Simulation = () => {

    //here we are storing the input value from the form.  
    const numFloors = parseInt(document.getElementById('floors').value);
    const numLifts = parseInt(document.getElementById('lifts').value);

    //this will make the blank body while removing the previous form content
    document.body.innerHTML = "";

    //func. to generate the floors and lifts.
    generateFloors(numFloors);
    generateLifts(numLifts);

}

//this func will generates the floor
const generateFloors = (numFloors) => {

    //this is an parent container which hold all the floors
    const floorsContainer = document.createElement('div');
    floorsContainer.id = 'floorsContainer';

    //last floor
    const lastFloor = document.createElement('div');
    lastFloor.className = 'floor';
    lastFloor.id = `Floor ${numFloors}`;
    lastFloor.innerHTML =
        `
        <div class="liftButtons">
            Floor ${numFloors}
            <button onsubmit="handleLiftRequest(${0},${numFloors})" class="lift-control down">DOWN</button>
        </div>
    `;
    floorsContainer.appendChild(lastFloor);

    //middle floors
    for (let i = numFloors - 1; i >= 1; i--) {
        const floor = document.createElement('div');
        floor.className = 'floor';
        floor.id = `Floor ${i}`;
        floor.innerHTML =
            `
            <div class="liftButtons">
                <button onsubmit="handleLiftRequest(${0},${i})" class="lift-control up">UP</button>
                Floor ${i}
                <button onsubmit="handleLiftRequest(${0},${i})" class="lift-control down">DOWN</button>
            </div>
        `;
        floorsContainer.appendChild(floor);
    }

    //ground floor
    const groundFloor = document.createElement('div');
    groundFloor.className = 'floor';
    groundFloor.id = 'Floor 0';
    groundFloor.innerHTML =
        `
        <div class="liftButtons">
            <button onsubmit="handleLiftRequest(${0},${0})" class="lift-control up">UP</button>
            Floor 0
        </div>
    `;
    floorsContainer.appendChild(groundFloor);

    //now this whole floorContainer(parent container) will append on body
    document.body.appendChild(floorsContainer);
}

const generateLifts = (numLifts) => {

    //this helps to locate ground floor
    const groundFloor = document.getElementById('Floor 0');

    for (let i = 0; i < numLifts; i++) {
        //lift
        const lifts = document.createElement('div');
        lifts.className = 'lift';
        //leftDoor
        const leftDoor = document.createElement('div');
        leftDoor.className = 'leftDoor';
        //rightDoor
        const rightDoor = document.createElement('div');
        rightDoor.className = 'rightDoor';
        //leftDoor and rightDoor will append to the lift
        lifts.appendChild(leftDoor);
        lifts.appendChild(rightDoor);

        //this lift container will append at ground floor because initially all lifts are at ground floor
        groundFloor.appendChild(lifts);

    }

}


// Step 4.3: Handle Lift Requests
const handleLiftRequest = (liftIndex, floorIndex) => {
    const lift = lifts[liftIndex];
    const requestedFloor = floorIndex + 1;

    // Add the requested floor to the targetFloors array for the corresponding lift
    lift.targetFloors.push(requestedFloor);

    // If the lift is currently stopped, start moving it towards the requested floor
    if (lift.direction === 'stopped') {
        moveLift(liftIndex);
    }
}

// Step 4.4: Move Lift
const moveLift = (liftIndex) => {
    const lift = lifts[liftIndex];
    const targetFloor = lift.targetFloors[0];

    // Determine the direction of the lift movement
    if (lift.currentFloor < targetFloor) {
        lift.direction = 'up';
    } else if (lift.currentFloor > targetFloor) {
        lift.direction = 'down';
    }

    // Calculate the distance and duration for the lift movement
    const distance = Math.abs(lift.currentFloor - targetFloor) * floorHeight;
    const duration = distance * liftSpeed;

    // Animate the lift movement
    animateLift(liftIndex, targetFloor, duration, () => {
        // Update the current floor and remove the reached target floor from the array
        lift.currentFloor = targetFloor;
        lift.targetFloors.shift();

        // If there are more target floors, continue moving the lift
        if (lift.targetFloors.length > 0) {
            moveLift(liftIndex);
        } else {
            lift.direction = 'stopped';
        }

        // Call the updateDisplay function to show the updated lift status
        updateDisplay();
    });
}

// Step 4.5: Animate Lift Movement
const animateLift = (liftIndex, targetFloor, duration, callback) => {
    const liftElement = document.querySelectorAll('.lifts')[liftIndex];
    const distance = Math.abs(lifts.currentFloor - targetFloor) * floorHeight;
    const direction = lifts.currentFloor < targetFloor ? 1 : -1;

    // Calculate the distance to move per frame
    const distancePerFrame = (distance / duration) * 10;
    let currentDistance = 0;

    // Interval-based animation
    const animationInterval = setInterval(() => {
        if (currentDistance >= distance) {
            clearInterval(animationInterval);
            callback();
        } else {
            currentDistance += distancePerFrame;
            liftElement.style.transform = `translateY(${direction * currentDistance}px)`;
        }
    }, 10);
}


// Step 4.6: Update Lift Status Display
const updateDisplay = () => {
    const statusDisplay = document.getElementById('statusDisplay');
    statusDisplay.innerHTML = '';

    lifts.forEach((lift, index) => {
        statusDisplay.innerHTML += `Lift ${index + 1}: Current Floor - ${lift.currentFloor
            }, Direction - ${lift.direction}<br>`;
    });
}

const liftSimulate = () => {
    // Initialize the state of each lift
    for (let i = 0; i < numLifts; i++) {
        lifts.push({
            currentFloor: 0, // Starting floor for all lifts
            direction: 'stopped', // Initial direction of all lifts
            targetFloors: [], // Array to store requested floors for each lift
        });
    }
    // Call the updateDisplay function to show the initial lift status
    updateDisplay();
}