//dataStore is an object which holds all the variables used for the simulation
const dataStore = {
    numFloors: 0, // Total number of floors in the building
    numLifts: 0, // Total number of lifts in the building
    liftPositions: [], // Current floor position of each lift
    liftDirections: [], // Current direction of each lift
    isLiftBusy: [], // Status of all the lifts
    liftRequestQueue: [], // Queue to store lift requests

    // Initialize the data store with the given number of floors and lifts
    initialize(numFloors, numLifts) {
        this.numFloors = numFloors;
        this.numLifts = numLifts;
        this.liftPositions = Array(numLifts).fill(0); // Initialized to 1st floor
        this.liftDirections = Array(numLifts).fill(null); // No direction initially
        this.isLiftBusy = Array(numLifts).fill(false); // Buttons not pressed initially
        this.liftRequestQueue = []; // Initialize the lift request queue
    },

    // Update lift position for a specific lift
    updateLiftPosition(liftIndex, floor) {
        this.liftPositions[liftIndex] = floor;
    },

    // Get the current position of a specific lift
    getLiftPosition(liftIndex) {
        return this.liftPositions[liftIndex];
    },

    // Update lift direction for a specific lift
    updateLiftDirection(liftIndex, direction) {
        this.liftDirections[liftIndex] = direction;
    },

    // Get the current direction of a specific lift
    getLiftDirection(liftIndex) {
        return this.liftDirections[liftIndex];
    },

    // Update lift status for a specific lift
    updateLiftStatus(liftIndex, status) {
        this.isLiftBusy[liftIndex] = status;
    },

    // Get the busy status of a specific lift
    getLiftBusyStatus(liftIndex) {
        return this.isLiftBusy[liftIndex];
    },

    // Add a lift request to the queue
    addLiftRequest(floor, direction) {
        this.liftRequestQueue.push({ floor, direction });
    },

    // Get the next lift request from the queue
    getNextLiftRequest() {
        return this.liftRequestQueue.shift();
    },

    // Check if the lift request queue is empty
    isLiftRequestQueueEmpty() {
        return this.liftRequestQueue.length === 0;
    }
}

//this function is called when the form is submitted, when the submit button is pressed.
const Simulation = () => {

    //here we are storing the input value from the form.  
    const numFloors = parseInt(document.getElementById('floors').value);
    const numLifts = parseInt(document.getElementById('lifts').value);

    //this will make the blank body while removing the previous form content
    document.body.innerHTML = "";

    //update the values in the dataStore object
    dataStore.initialize(numFloors, numLifts);
    //func. to generate the floors and lifts.
    generateFloors(numFloors);
    generateLifts(numLifts);

}

//this func will generates the floor
const generateFloors = (numFloors) => {
    const floorContainer = document.createElement('div');
    floorContainer.id = "floorContainer";
    floorContainer.classList.add('floorContainer');

    for (let i = numFloors - 1; i >= 0; i--) {
        const floor = document.createElement('div');
        floor.id = `floor-${i}`;
        floor.classList.add('floor');

        const floorControl = document.createElement('div');
        floorControl.classList.add('floorControl');

        if (i !== numFloors - 1) {
            const upButton = document.createElement('button');
            upButton.textContent = '▲';
            upButton.classList.add('up-button')
            upButton.addEventListener('click', () => {
                requestLift(i, 'up');
            });
            floorControl.appendChild(upButton);
        }

        const floorNumber = document.createElement('span');
        floorNumber.classList.add('floor-number');
        floorNumber.textContent = `Floor ${i}`;
        floorControl.appendChild(floorNumber);

        if (i !== 0) {
            const downButton = document.createElement('button');
            downButton.textContent = '▼';
            downButton.classList.add('down-button')
            downButton.addEventListener('click', () => {
                requestLift(i, 'down');
            });
            floorControl.appendChild(downButton);
        }
        //floor.appendChild(floorNumber);
        floor.appendChild(floorControl);
        floorContainer.appendChild(floor);
        document.body.appendChild(floorContainer);
    }
}

//this func will generates the lifts on ground floor initially
const generateLifts = (numLifts) => {
    const groundFloor = document.getElementById('floor-0');

    const liftWidth = 80; // Width of each lift including margins

    for (let i = 0; i < numLifts; i++) {
        const lift = document.createElement('div');
        lift.classList.add('lift');
        lift.id = `lift-${i}`;
        lift.style.left = `${260 + i * liftWidth}px`; // Set the left position of each lift

        // Set the initial position to floor 1

        const liftDoors = document.createElement('div');
        const leftDoor = document.createElement('div');
        const rightDoor = document.createElement('div');
        leftDoor.classList.add('door-left');
        rightDoor.classList.add('door-right');
        liftDoors.appendChild(leftDoor);
        liftDoors.appendChild(rightDoor);

        lift.appendChild(liftDoors);

        groundFloor.appendChild(lift);
    }
}

//this func will allocate the lift based on the floor and direction 
const allocateLift = (floor, direction) => {
    const liftPositions = dataStore.liftPositions;
    const liftDirections = dataStore.liftDirections;
    const isLiftBusy = dataStore.isLiftBusy;

    const availableLifts = [];
    for (let i = 0; i < liftPositions.length; i++) {
        if (!isLiftBusy[i]) {
            if (liftDirections[i] === null) {
                availableLifts.push(i);
            } else if (direction === 'up' && liftPositions[i] < floor) {
                availableLifts.push(i);
            } else if (direction === 'down' && liftPositions[i] > floor) {
                availableLifts.push(i);
            }
        }
    }
    // find the close lift if available
    if (availableLifts.length > 0) {
        let closestLiftIndex = availableLifts[0];
        let minDistance = Math.abs(liftPositions[closestLiftIndex] - floor);

        for (let i = 1; i < availableLifts.length; i++) {
            const liftIndex = availableLifts[i];
            const distance = Math.abs(liftPositions[liftIndex] - floor);
            if (distance < minDistance) {
                minDistance = distance;
                closestLiftIndex = liftIndex;
            }
        }
        console.log("THE CLOSEST LIFT IS", closestLiftIndex)
        return closestLiftIndex
    }
    return -1
}

//this func will request lift based on the floor and direction
const requestLift = (floor, direction) => {
    const allLiftsAreBusy = dataStore.isLiftBusy.every((value) => value === true);

    if (!allLiftsAreBusy) {
        console.log("Lift requested on floor", floor, " which is going ", direction)
        const allocatedLift = allocateLift(floor, direction)
        dataStore.isLiftBusy[allocatedLift] = true;
        console.log("Lift", allocatedLift, "has been allocated")

        if (allocatedLift !== -1) {
            animateLift(allocatedLift, floor, direction)
            // Disable the floor buttons
            disableLiftButton(floor, direction)
        }
    } else {
        console.log("ALL LIFTS ARE BUSY!!")
        dataStore.addLiftRequest(floor, direction); // Add the lift request to the queue
        disableLiftButton(floor, direction)
        console.log("Lift request added to the queue:", dataStore.liftRequestQueue);
    }
}

const disableLiftButton = (floor, direction) => {
    let floorButtons = document.getElementById(`floor-${floor}`).querySelector('.down-button');
    if (direction === 'up') {
        floorButtons = document.getElementById(`floor-${floor}`).querySelector('.up-button');
    }
    floorButtons.disabled = true;
}

const enableLiftButton = (floor, direction) => {
    let floorButtons = document.getElementById(`floor-${floor}`).querySelector('.down-button');
    if (direction === 'up') {
        floorButtons = document.getElementById(`floor-${floor}`).querySelector('.up-button');
    }
    floorButtons.disabled = false;
}

//this func handles whole lift tarnsformation mechanism
const animateLift = (liftNumber, targetFloor, direction) => {
    const liftElement = document.getElementById(`lift-${liftNumber}`);
    const currentFloor = dataStore.liftPositions[liftNumber];
    const floorHeight = document.getElementById('floor-1').clientHeight + 1; // Height of each floor in pixels
    // Calculate the correct distance to travel based on the current and target floor
    const distanceToTravel = Math.abs(targetFloor) * floorHeight;

    // Calculate the duration of the animation based on the number of floors to travel
    const duration = Math.abs(currentFloor - targetFloor) * 2000; // Delay of 1s per floor

    liftElement.style.transition = `transform ${duration / 1000}s linear`;
    liftElement.style.transform = `translateY(-${distanceToTravel}px)`;

    setTimeout(() => {
        liftElement.classList.add('open');
        setTimeout(() => {
            // Close the lift doors after 2.5 seconds
            liftElement.classList.remove('open');
            setTimeout(() => {
                dataStore.isLiftBusy[liftNumber] = false;
                dataStore.liftDirections[liftNumber] = null;
                dataStore.updateLiftPosition(liftNumber, targetFloor);

                enableLiftButton(targetFloor, direction);

                // Check if there are pending lift requests in the queue
                if (dataStore.liftRequestQueue.length > 0) {
                    const nextRequest = dataStore.liftRequestQueue.shift(); // Get the next request from the queue
                    const { floor, direction } = nextRequest;
                    requestLift(floor, direction); // Process the next request
                }
            }, 2500); // lifts door closed
        }, 2500); // lifts door open
    }, duration); // Add a delay of 5 seconds before processing the next request
}
