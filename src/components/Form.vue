<template>
<div class="flex flex-col space-y-2 p-4 relative">
  <div v-if="bye" class="absolute w-full h-full bg-white top-0 left-0">
    <div class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">Bye. See you later.</div>
  </div>
  <div class="flex items-center space-x-2">
    <div class="font-semibold text-nowrap">> Car name?</div>
    <div class="flex-1">
      <input @keydown="submitName" v-model="formData.name" class="w-full outline-none border-b" />
    </div>
  </div>

  <div class="flex items-start space-x-2">
    <div class="font-semibold text-nowrap">> Answer: </div>
    <div>
      {{ answer }}
    </div>
    <div v-if="needWheelsField" class="flex-1">
      <input type="number" @keydown="submitWheels" v-model="formData.wheels" class="w-full outline-none border-b" />
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import carService from '../services/car.service.ts'
import { AxiosResponse, AxiosError } from 'axios';

interface FormData {
  name: string;
  wheels: number;
}

interface Car {
  id: number;
  name: string;
  wheels: number;
}

const formData = reactive<FormData>({
  name: '',
  wheels: 0,
})

enum Action {
  ALL = 'All',
  TWO_WHEELS = '2-wheel-car',
  FOUR_WHEELS = '4-wheel-car',
  BYE = 'Bye',
}

const answer = ref<string>('')
const needWheelsField = ref<boolean>(false)

const bye = ref<boolean>(false)

const submitName = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    if ((event.target as HTMLInputElement)?.value === Action.ALL) {
      carService.getAll().then((res: AxiosResponse) => {
        const allCars: Car[] = res.data?.data
        const jointNames: string = allCars.map(item => item.name).join(', ')
        const count: number = allCars.length

        answer.value = `[${count}] ${jointNames}`
      })
      .catch((err: AxiosError) => {
        console.error(err)
      })
    }
    else if ((event.target as HTMLInputElement)?.value === Action.TWO_WHEELS) {
      carService.getByWheels(2).then((res: AxiosResponse) => {
        const allCars: Car[] = res.data?.data
        const jointNames: string = allCars.map(item => item.name).join(', ')
        const count: number = allCars.length

        answer.value = `[${count}] ${jointNames}`
      })
      .catch((err: AxiosError) => {
        console.error(err)
      })
    }
    else if ((event.target as HTMLInputElement)?.value === Action.FOUR_WHEELS) {
      carService.getByWheels(4).then((res: AxiosResponse) => {
        const allCars: Car[] = res.data?.data
        const jointNames: string = allCars.map(item => item.name).join(', ')
        const count: number = allCars.length
        answer.value = `[${count}] ${jointNames}`
      })
      .catch((err: AxiosError) => {
        console.error(err)
      })
    }
    else if ((event.target as HTMLInputElement)?.value === Action.BYE) {
      bye.value = true
    }
    else {
      carService.findByName((event.target as HTMLInputElement)?.value).then((res: AxiosResponse) => {
        const car: Car = res.data?.data
        answer.value = `"${car.name}" has ${car.wheels} wheels.`
        needWheelsField.value = false
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 404) {
          answer.value = `"${(event.target as HTMLInputElement)?.value}" is not on my list. Number of wheels?`
          needWheelsField.value = true
        } else {
          console.error(err)
        }
      })
    }
  }
}

const submitWheels = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    carService.create(formData).then(() => {
      answer.value = 'Thanks. I updated the information.'
      needWheelsField.value = false
    })
    .finally(() => {
      formData.name = ''
      formData.wheels = 0
    })
  }
}
</script>