<script setup>
import { reactive } from 'vue';
import {Listbox,ListboxButton,ListboxOptions,ListboxOption} from '@headlessui/vue'
import axios from 'axios';
import api from '@/services/api';
import {useToast} from "vue-toastification"
import { useRouter,useRoute } from 'vue-router';
import {EyeIcon,EyeSlashIcon} from "@heroicons/vue/24/solid"

const router = useRouter()

const data = reactive({
    hidePassword : true,
    isLoading : true,
    userData : {
        email : '',
        password : "",
    }
})

const Toast = useToast()

const login = async () => {
    const payload = {
        email : data.userData.email,
        password : data.userData.password,
    }
    try {
        const response = await api.post("/users/login", payload)
        if(response.data.success){
            localStorage.setItem("token",response.data.token)
            Toast.success("Login Successfully")
            router.replace("/home")
        }
    } catch (error) {
        Toast.error("Failed To Login")
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
            <p class="text-bold text-xl mb-8">LOGIN</p>
            <form>
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

                <div class="flex items-center justify-between w-full">
                    <button class="button bg-green-600 py-2 px-4 rounded-lg hover:bg-green-500 cursor-pointer" @click.prevent="login">Login</button>
                    <div class="flex flex-col justify-center items-center p-4 transform scale-80">
                        <p class="text-sm">Don't Have an Acount?</p>
                        <RouterLink to="/" class="text-lg text-blue-500">Register</RouterLink>
                    </div>
                </div>
            </form>     
        </div>
    </div>
</template>