import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FoodMetricService } from './services/foodMetric.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public foodMetricForm!: FormGroup;
  public foodSelectForm!: FormGroup;
  foodMetricsList:any = [];
  meal:any = [];
  calorieLimit: number = 500;

  constructor( 
    private fb: FormBuilder,
    private foodMetricService: FoodMetricService
  ) { }

  ngOnInit():void {
    this.foodMetricForm = this.fb.group({
      name: ['', Validators.required ],
      brand: ['', Validators.required ],
      grams: [0, Validators.required ],
      calories: [0, Validators.required ]
    });

    this.foodMetricService.getAllFoodMetrics()
      .subscribe({
        next: (foodMetrics) => {
          this.foodMetricsList = foodMetrics;

          for(const foodMetricElement of this.foodMetricsList) {
            foodMetricElement.name = `${foodMetricElement.name} ${foodMetricElement.brand ? "(" + foodMetricElement.brand  + ")" : ""}`
          }
          console.log(this.foodMetricsList)
        },
        error: (err) => console.log(err)
      })

    this.foodSelectForm = this.fb.group({
      foodId: [null]
    })
  }

  saveFoodMetric() {
    this.foodMetricService.createFoodMetric({...this.foodMetricForm.value, caloriesPerGram: this.foodMetricForm.value.calories/this.foodMetricForm.value.grams})
      .subscribe({
        next: (foodMetric) => console.log(foodMetric),
        error: (err) => console.log(err)
      });
    this.foodMetricForm.reset();
  }

  addFoodToMeal() {
    if (!this.foodSelectForm.value.foodId) return;
    const foodExistsInMeal = this.meal.filter((food:any) => food.uid === this.foodSelectForm.value.foodId);
    console.log(foodExistsInMeal)
    if (foodExistsInMeal.length) return;

    this.meal.push(this.foodMetricsList.find((foodMetricElement:any) => foodMetricElement.uid.toString() === this.foodSelectForm.value.foodId));
    console.log(this.meal);

    const percentages = 0;

    for(const food of this.meal) {
      food.mealPercentage = percentages;
    }
  
  }

  recalculateMealPortions() {
    for(const food of this.meal) {
      const percentageValue = food.mealPercentage * this.calorieLimit / 100;
      food.grams = percentageValue * 1 / food.caloriesPerGram;
    }
  }

}
