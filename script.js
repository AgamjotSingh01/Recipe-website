let search = document.getElementById("search-btn");

search.addEventListener("click", () => {
  let dish = document.getElementById("search").value;

  if ((dish != "") & (dish != null)) {
    document.querySelectorAll(".start")[0].classList.add("hidden");
    main();
  } else {
    document.querySelectorAll(".container")[0].innerHTML = " ";
    document.querySelectorAll(".start")[0].classList.remove("hidden");
  }

  async function main() {
    let api_data = await getdata(dish);
    if(api_data.meals == null || api_data.meals == undefined)
    {
        document.querySelectorAll(".start")[0].classList.remove("hidden");
        document.querySelectorAll(".start")[0].innerHTML = `No such dish found as "${dish}"`;
        
        return;
    }
    let foods = api_data.meals;
    let recipies = [];
    let recipies_ingredients = [];
    let recipies_measures = [];
    for (let i = 0; i < foods.length; i++) {
      for (let j = 1; j < 21; j++) {
        if (
          (foods[i][`strIngredient${j}`] != null) &
          (foods[i][`strIngredient${j}`] != "")
        ) {
          recipies_ingredients.push(foods[i][`strIngredient${j}`]);
          recipies_measures.push(foods[i][`strMeasure${j}`]);
        }
      }
      recipies[i] = {
        name: foods[i].strMeal,
        category: foods[i].strCategory,
        country: foods[i].strArea,
        image: foods[i].strMealThumb,
        link: foods[i].strYoutube,
        instructions: foods[i].strInstructions,
        ingredient: recipies_ingredients,
        measures: recipies_measures,
      };

      recipies_ingredients = [];
      recipies_measures = [];
    }

    const container = document.querySelectorAll(".container")[0];
    let elements = "";
    let ingredient_query = '';

    recipies.forEach((recipie,index) => {

        recipie.ingredient.forEach((ingredient_loop,index)=>{

            ingredient_query = ingredient_query + `<li>${index+1}) ${ingredient_loop}: ${recipie.measures[index]}</li>`;

        })
        console.log(ingredient_query);

        elements =
        elements +
        `<div class="card">
                <img class="thumbnail" src=${recipie.image} alt='img'>
                <div class="description">
                    <div class="dish_name">
                        ${recipie.name}
                    </div>
                    <div class="dish_description">
                        Category: ${recipie.category}<br>
                        Area : ${recipie.country}
                    </div>
                    <button type="button" class="recipie-btn" id="${index}">View Recipie</button>

                    <div class="recipe_card hidden">
                        <button class="close" id="${index}">
                            X
                        </button>

                        <div class="dish_name name1">${recipie.name}</div>

                        <ul>Indgridients:
                            ${ingredient_query}
                        </ul>

                        <div class="instr">Instructions:</div>
                        <div class="instructions">
                            ${recipie.instructions}
                        </div>
                    </div>

                </div>
            </div>
            `;
        ingredient_query = '';
    });

    container.innerHTML = elements;
    const recipe_btn = document.querySelectorAll(".recipie-btn");

    recipe_btn.forEach((btn)=>{
        btn.addEventListener("click", () => {
            document.querySelectorAll(".recipe_card")[btn.id].classList.remove("hidden");
        });
    })

    document.querySelectorAll(".close").forEach((close)=>{
        document.querySelectorAll(".close")[close.id].addEventListener("click", () => {
          document.querySelectorAll(".recipe_card")[close.id].classList.add("hidden");
        });
    })
    



  }

});

async function getdata(dish) {
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + dish
  );
  let data = await response.json();
  return data;
}
