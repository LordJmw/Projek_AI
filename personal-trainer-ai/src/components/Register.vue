<script setup>
import { reactive } from 'vue';
import {Listbox,ListboxButton,ListboxOptions,ListboxOption} from '@headlessui/vue'
import axios from 'axios';
import api from '@/services/api';
import {useToast} from "vue-toastification"
import { useRouter } from 'vue-router';
import {EyeIcon,EyeSlashIcon} from "@heroicons/vue/24/solid"

const router = useRouter()

const data = reactive({
    isLoading : true,
    hidePassword : true,
    userData : {
        name : "",
        email : '',
        password : "",
        Birthday : "2000-01-01",
        gender : "male",
        weight : "",
        height : "",
        daily_activity_category : null,
        goal : "cut"
    }
})

const Toast = useToast()

const activity_categories = [
    {
        value : "Little/No Activity",
        label : "Little/No Avitivity",
        description : "Daily Activity that requires litte energy like office job or driving"
    },
    {
        value : "A Little Active",
        label : "A Little Active",
        description : "Daily Activities that require some energy like light workout, house chores,etc"
    },
    {
        value : "Moderately Active",
        label : "Moderately Active",
        description : "Daily Activities that require the normal amount of energy like standing, physical work or light workout regularly"
    },
    {
        value : "Very Active",
        label : "Very Active",
        description : "Daily Activity that require high pyhsical effort like construction worker or heavy workout regularly"
    },
]

const Register = async () => {
    const payload = {
        name : data.userData.name,
        email : data.userData.email,
        password : data.userData.password,
        birthdate : data.userData.Birthday,
        gender : data.userData.gender == "male" ? "m" : 'f',
        goal : data.userData.goal,
        daily_activity_category : data.userData.daily_activity_category,
        weight_kg : data.userData.weight,
        height_cm : data.userData.height
    }
    try {
        const response = await api.post("/users/register", payload)
        if(response.data.success){
            Toast.success("User Registered Successfully")
            router.replace("/login")
        }
    } catch (error) {
        Toast.error("Failed To Register User")
        console.error(error)
    }
}

const ToggleHidePassword = () => {
    data.hidePassword = !data.hidePassword
}
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-200 overflow-auto py-10">
        <div class="bg-white w-[90%] md:w-[40%]  p-4">
            <form>
                <label for="Name" class="block mb-2 text-sm">Name</label>
                <input type="text" class="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none  focus:border-black focus:ring-black-500" 
                placeholder="Enter Your Name" v-model="data.userData.name">

                <label for="Email" class="block mb-2 text-sm">Email</label>
                <input type="email" class="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none  focus:border-black focus:ring-black-500" 
                placeholder="Enter Your Email" v-model="data.userData.email">

                <label for="password" class="block mb-2 text-sm">Password</label>
                <div class="relative">
                <input 
                    :type="data.hidePassword ? 'password' : 'text'"
                    class="w-full mb-4 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-black-500"
                    placeholder="Enter Your password"
                    v-model="data.userData.password"
                >
                <button 
                    @click="ToggleHidePassword" 
                    type="button" 
                    class="absolute right-3 -top-[-10px] text-gray-600 hover:text-black"
                >
                    <component 
                    :is="data.hidePassword ? EyeSlashIcon : EyeIcon" 
                    class="w-5 h-5" 
                    />
                </button>
                </div>
                
                <label for="Birthday" class="block mb-2 text-sm">Birthday</label>
                <input type="date" class="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-black focus:border-black mb-4"
                 v-model="data.userData.Birthday">

                <label class="block mb-2 text-sm" for="gender">Gender</label>
                <select class="w-full mb-4 focus:outline-none focus:border-black focus:ring-black px-4 py-2 border border-gray-300 rounded-lg"  v-model="data.userData.gender">
                    <option value="male" :disabled="data.userData.gender==='male'">Male</option>
                    <option value="female" :disabled="data.userData.gender==='female'">Female</option>
                </select>

                <label for="Weight" class="block mb-2 text-sm">Weight</label>
                <input type="number" class="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-black focus:border-black mb-4"
                placeholder="Enter Your Weight" min="20" max="200" v-model="data.userData.weight">

                <label for="Height" class="block mb-2 text-sm">Height</label>
                <input type="number" class="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-black focus:border-black mb-4"
                placeholder="Enter Your Height(cm)" min="50" max="250" v-model="data.userData.height">

                <label for="goal" class="block mb-2 text-sm">What is Your Goal</label>
                <select class="border border-gray-300 py-2 px-4 focus:outline-none focus:ring-black focus:border-black w-full mb-4"
                v-model="data.userData.goal">
                    <option value="cut" :disabled="data.userData.goal==='Reduce my Weight'">Reduce my Weight</option>
                    <option value="maintain" :disabled="data.userData.goal==='Maintain my Weight'">Maintain my Weight</option>
                    <option value="bulk" :disabled="data.userData.goal==='Increase my Weight'">Increase my Weight</option>
                </select>
                <!-- <label for="daily_activity_category" class="block mb-2 text-sm">What is Your Daily Activity Category</label> -->
                <Listbox v-model="data.userData.daily_activity_category" class="mb-7">
                    <div class="relative w-full">
                        <ListboxButton class="w-full border border-gray-300 text-left rounded-lg focus:ring-black focus:outline-none px-4 py-2 flex justify-between items-center">
                            <span>
                                {{ data.userData.daily_activity_category || "Select an activity level" }}
                            </span>
                            
                            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </ListboxButton>
                        <ListboxOptions class="p-2 absolute z-10 mt-1 w-full bg-white shadow-md rounded-lg border border-gray-200">
                            <ListboxOption
                                v-for="(activity,index) in activity_categories"
                                :key="index"
                                :value="activity.value"
                                :disabled="activity.disabled"
                                class="p-3 cursor-pointer hover:bg-gray-100 rounded-lg mb-1 border border-gray-200"
                                >
                                <p class="text-base font-semibold">{{ activity.label }}</p>
                                <p class="text-sm text-gray-500">{{ activity.description }}</p>
                            </ListboxOption>
                        </ListboxOptions>
                    </div>
                </Listbox>
                
                <button class="button bg-green-600 py-2 px-4 rounded-lg hover:bg-green-500 cursor-pointer" type="submit" @click.prevent="Register">Submit</button>
            </form>     
        </div>
    </div>
</template>