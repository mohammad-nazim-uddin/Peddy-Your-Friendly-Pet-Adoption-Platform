function loadAllPets() {
    fetch('https://openapi.programming-hero.com/api/peddy/pets')
        .then(res => res.json())
        .then(data => showAllPets(data.pets))
}

const loadpetDetails = async (petId) => {
    const url = `https://openapi.programming-hero.com/api/peddy/pet/${petId}`

    const res = await fetch(url)
    const data = await res.json()

    displayData(data.petData)

}

const displayData = (petData) => {


    const modalContent = document.getElementById('modal-content');
    document.getElementById('modal').showModal()

    modalContent.innerHTML = `
        <img src="${petData.image}"/>
        <p class="text-2xl font-bold">${petData.pet_name}</p>

        <section class = "flex gap-5 mt-3">

            <div>
                <p class="text-lg"><i class="fa-solid fa-table-cells-large"></i> Breed: ${petData.breed ? petData.breed : "Not Specified"}</p>
                <p class="text-lg"><i class="fa-solid fa-mercury"></i> 
                Gender: ${petData.gender ? petData.gender : "Not Specified"}</p>

                <p class="text-lg"><i class="fa-solid fa-mercury"></i> 
                Vaccinated Status: ${petData.vaccinated_status ? petData.vaccinated_status : "Not Specified"}</p>
            </div>

            <div>
                 <p class="text-lg">
                <i class="fa-regular fa-calendar"></i> 
                Birth: ${petData.date_of_birth.substring(0, 4)}</p>
                

                <p class="text-lg"><i class="fa-solid fa-dollar-sign"></i>
                Price: ${petData.price}</p>
            </div>
        
        </section>

        <div class="mt-5">
            <h1 class="text-2xl mb-3 font-semibold">Details Information</h1>
        <p>${petData.pet_details}</p>
        </div>

    `
}

function showAllPets(pets) {
    const petsContainer = document.getElementById('pet-section')
    petsContainer.innerHTML = ""
    if (pets.length == 0) {
        petsContainer.classList.remove("grid")
        petsContainer.innerHTML = `
            <div class="w-full flex flex-col gap-5 justify-center items-center">
                <img class="" src="images/error.webp"/>
                <h1 class="font-bold text-2xl">No information availabe</h1>
                <p class="text-center">It is a long established fact that a reader will be distracted by the readable content of a page when looking at 
its layout. The point of using Lorem Ipsum is that it has a.</p>
            </div>
        `
        return
    }
    else {
        petsContainer.classList.add("grid")
    }
    pets.forEach(pet => {
        const birthDate = `${pet.date_of_birth}`
        const birthYear = birthDate.substring(0, 4)

        const card = document.createElement('div')
        card.classList = 'card card-compact'
        card.innerHTML = `
         <div class="card bg-base-100 shadow-xl text-left">
            <figure class="px-5 pt-5">
                 <img
                     class="w-[272px] h-[160px]" 
                     src="${pet.image}"
                     alt="Shoes"
                     class="rounded-xl" />
            </figure>
            <div class="card-body mx-10">
                <h2 class="card-title text-xl font-bold">${pet.pet_name}</h2>
                <p class="text-lg"><i class="fa-solid fa-table-cells-large"></i> Breed: ${pet.breed ? pet.breed : "Not Specified"}</p>
                <p class="text-lg">
                <i class="fa-regular fa-calendar"></i> 
                Birth: ${pet.date_of_birth ? birthYear : "not specified"}</p>
                <p class="text-lg"><i class="fa-solid fa-mercury"></i> 
                Gender: ${pet.gender ? pet.gender : "not specified"}</p>
                <p class="text-lg"><i class="fa-solid fa-dollar-sign"></i>
                Price: ${pet.price ? pet.price : "Not specified"}</p>

                <div class="flex justify-between text-lg">
                    <button class="btn text-xl" id="liked-btn-${pet.petId}" class="text-xl"><i class="fa-regular fa-thumbs-up"></i></button>
                    <button class="btn text-xl" id="adopt-btn-${pet.petId}">Adopt</button>
                    <button class="btn text-xl" onclick=loadpetDetails(${pet.petId})>Details</button>
                </div>
    
            </div>
</div>
      
        `
        petsContainer.appendChild(card)

        const adoptBtn = document.getElementById(`adopt-btn-${pet.petId}`)
        console.log(adoptBtn)
        adoptBtn.addEventListener('click', () => {
            if (!adoptBtn.disabled) {
                // Create the countdown element
                const countdown = document.createElement('span');
                countdown.classList.add('countdown');
                adoptBtn.appendChild(countdown);
            
                // Start the countdown
                let count = 3;
                countdown.textContent = count;
                const interval = setInterval(() => {
                  count--;
                  countdown.textContent = count;
            
                  if (count === 0) {
                    clearInterval(interval);
                    adoptBtn.textContent = "Adopted";
                    adoptBtn.disabled = true; // Disable the button after countdown
                  }
                }, 1000);
              }
            
        })

        const btn = document.getElementById(`liked-btn-${pet.petId}`);
        btn.addEventListener('click', () => {
            btn.classList = 'liked'
            console.log(`${pet.petId}`)

            const imgContainer = document.getElementById('liked-pets')
            const div = document.createElement('div')
            div.classList = "h-32"
            div.innerHTML = `
                <img class="w-[124px] h-[124px]" src="${pet.image}"/>
             
           `



            imgContainer.appendChild(div)
        })
    })

    const sortButton = document.getElementById('sortButton');
    sortButton.addEventListener('click',
        () => {

            pets.sort((a, b) => a.price - b.price);


            petsContainer.innerHTML = ''; // Clear existing cards
            showAllPets(pets);
        });
}


const loadCatagories = () => {
    fetch('https://openapi.programming-hero.com/api/peddy/categories')
        .then(res => res.json())
        .then(data => displayCatagories(data.categories))

        .catch((error) => console.log(error))
}
const displayCatagories = (categories) => {
    categories.forEach(item => {
        const categories = document.getElementById('categories')

        const btnContainer = document.createElement('div')
        btnContainer.innerHTML = `

                <button id="${item.category}" onclick = loadCategoriesPets('${item.category}') class="rounded-full border-2" >
                    <div class="flex gap-5 items-center px-12 py-2">
                        <img src="${item.category_icon}" />
                        <p class="text-xl font-bold">${item.category}</p>
                    </div>
                </button>
        `


        categories.appendChild(btnContainer)
    })
}

const loadCategoriesPets = async (category) => {
    try {

        const loader = document.getElementById('loader');
        loader.classList.remove("hidden");
        const response = await fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`);
        const data = await response.json();


        setTimeout(() => {
            loader.classList.add("hidden"); // 
            showAllPets(data.data);
        }, 2000);
    } catch (error) {
        console.error('Error:', error);

    }
};

loadCatagories()
loadAllPets()

