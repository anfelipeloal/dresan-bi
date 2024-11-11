<template>
    <div class="w-full flex flex-col justify-center items-center">
        <div class=" w-100 relative">
            <img src="./loader-unscreen.gif" alt="" >
            <div class="text text-gray-700 absolute top-2/3 left-1/3">{{ message }}</div>
        </div>

    </div>
</template>

<script setup>
defineProps({
    message: {
        type: String,
        required: true,
        default: 'Loading',
    },
});
</script>

<style>
/* From Uiverse.io by csozidev */
/* 3D tower loader made by: csozi | Website: www.csozi.hu*/

.text {
  height: 30px;
  background-color: transparent;
  margin-top: 20px;
  text-align: center;
}

.text::after {
  content: "";
  color: blue;
  animation: text 1s 0s infinite;
}

@keyframes text {
  0% {
    content: "";
  }

  30% {
    content: ".";
  }

  60% {
    content: "..";
  }

  100% {
    content: "...";
  }
}

.loader {
  scale: 3;
  height: 50px;
  width: 40px;
  opacity: .8;
}

.box {
  position: relative;
  opacity: 0;
  left: 10px;
}

.side-left {
  position: absolute;
  background-color: #2836b5;
  width: 19px;
  height: 5px;
  transform: skew(0deg, -25deg);
  top: 14px;
  left: 10px;
}

.side-right {
  position: absolute;
  background-color: #6366f1;
  width: 19px;
  height: 5px;
  transform: skew(0deg, 25deg);
  top: 14px;
  left: -9px;
}

.side-top {
  position: absolute;
  background-color: #8397f0;
  width: 20px;
  height: 20px;
  rotate: 45deg;
  transform: skew(-20deg, -20deg);
}

.box-1 {
  animation: from-left 4s infinite;
}

.box-2 {
  animation: from-right 4s infinite;
  animation-delay: 1s;
}

.box-3 {
  animation: from-left 4s infinite;
  animation-delay: 2s;
}

.box-4 {
  animation: from-right 4s infinite;
  animation-delay: 3s;
}

@keyframes from-left {
  0% {
    z-index: 20;
    opacity: 0;
    translate: -20px -6px;
  }

  20% {
    z-index: 10;
    opacity: 1;
    translate: 0px 0px;
  }

  40% {
    z-index: 9;
    translate: 0px 4px;
  }

  60% {
    z-index: 8;
    translate: 0px 8px;
  }

  80% {
    z-index: 7;
    opacity: 1;
    translate: 0px 12px;
  }

  100% {
    z-index: 5;
    translate: 0px 30px;
    opacity: 0;
  }
}

@keyframes from-right {
  0% {
    z-index: 20;
    opacity: 0;
    translate: 20px -6px;
  }

  20% {
    z-index: 10;
    opacity: 1;
    translate: 0px 0px;
  }

  40% {
    z-index: 9;
    translate: 0px 4px;
  }

  60% {
    z-index: 8;
    translate: 0px 8px;
  }

  80% {
    z-index: 7;
    opacity: 1;
    translate: 0px 12px;
  }

  100% {
    z-index: 5;
    translate: 0px 30px;
    opacity: 0;
  }
}
</style>
