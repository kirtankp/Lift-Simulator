
//stores lifts Availabilitiy
const availableLifts = new Map();
//stores lift position
const liftAt = new Map();
//store floor lift mapping
const floorLiftMap = new Map();
//store pending lift calls
const pendingCalls = [];


//this function starts when initial input form submitted
const Simulation = () => {
    mainUI()
}


//this is an mainUI or we can say simulationUI
const mainUI = () => {
    //storing the user input.
    const noOfFloor = document.querySelector("#floors").value
    const noOfLifts = document.querySelector("#lifts").value
    
    //clearing inputUI
    const container = document.querySelector(".container")
    container.innerHTML = ""

    //function to generate the floors and lift
    generateFloor(noOfFloor)
    generateLift(noOfLifts)
}

//generation floor based on the input
const generateFloor = (totalFloor) => {
    //we going to append all floors(in form of child) to floorsContainer(.container) 
    const floorsContainer = document.querySelector(".container");
    for (let i = totalFloor; i > 0; i--) {
        const floor = document.createElement("div");
        floor.className = "floorClass"
        const floorId = `floor-${i}`
        floor.id = floorId
        floor.innerHTML = 
        `
            <div class="floor-details">
            <button class="lift-control up">UP</button>
            <p class="floor-number">Floor-${i}</p> 
            <button class="lift-control down">DOWN</button>
            </div>
            <style>
                .floor-details{
                    display: flex;
                    flex-direction: column;
                    justifyContent: space-between;
                    alignItems: center;
                    height: 150px;
                    
                    
                }
            </style>
        ` 
        //eventListener for the up and down button
        floor.querySelector(".up").addEventListener("click", (event) => controlLiftCall(event));
        floor.querySelector(".down").addEventListener("click", (event) => controlLiftCall(event));
        //append floors(child)
        floorsContainer.appendChild(floor)
        floorLiftMap.set(floorId, null);
    }
    //one groundFloor is added initial all lift will stand there and has only up button 
    //and this floor will append to floorsContainer(container) 
    const groundFloor = document.createElement("div");
        groundFloor.className = "floorClass"
        groundFloor.id = "floor-0"       
        groundFloor.innerHTML = 
        `
            <div class="floor-details">
            <button class="lift-control up">UP</button>
            <p class="floor-number">Floor-0</p> 
            </div>
            <style>
                .floor-details{
                    display: flex;
                    flex-direction: column;
                    justifyContent: space-between;
                    alignItems: center;
                    height: 150px;
                    
                    
                }
            </style>
        ` 
        groundFloor.querySelector(".up").addEventListener("click", (event) => controlLiftCall(event));
        //append groundFloors(child)
        floorsContainer.appendChild(groundFloor)
        floorLiftMap.set("floor-0", null);
}


//generate the lifts based on the input
const generateLift = (totalLift) => {
    //initial of simulation we going to add all lifts at groundFloor so (append all lifts in floor-0(container)) 
    const groundFloor = document.querySelector(".container > #floor-0");
    for(let i = 1; i <= totalLift; i++){
        const currentLift = document.createElement("div");
        currentLift.className = "lift";
        currentLift.id = `lift-${i}`;
        
        currentLift.innerHTML = 
        `
            <div class="door left-door"></div>
            <div class="door right-door"></div>
            <style>
            .lift{
                height: 100px;
                width: 90px;
                background-color: #3dec7a;
                /* border: 1px solid white; */
                display: flex;
                flex-direction: row;
                overflow: hidden;
            }
            
            .door{
                background-color: #A1b9e6;
                height: 100%;
                width: 50%;
                transition: all 2.5s;
            }
            
            .left-door{
                border-right: 1px solid #ec63b1;
            }
            
            .right-door{
                border-left: 1px solid #ec63b1;
            }
            </style>
        `;
        availableLifts.set(`lift-${i}`, true);
        liftAt.set(`lift-${i}`, 0);
        groundFloor.appendChild(currentLift);
    }
    
}
