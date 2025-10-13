<template>
  <div class="container">
    <div class="error-content">
      <div class="error-code">404</div>
      <div class="error-message">哎呀！页面走丢了</div>
      <div class="error-description">
        您访问的页面可能已被移除、重命名或暂时不可用
      </div>
      
      <div class="dino-animation">
        <div class="dino"></div>
        <div class="ground"></div>
        <div class="cactus"></div>
      </div>
      
      <div class="action-buttons">
        <el-button type="primary" class="btn-home" @click="handleBack">
          <i class="el-icon-back"></i> 返回上一个页面
        </el-button>
        <el-button type="success" @click="goHome">
          <i class="el-icon-house"></i> 返回首页
        </el-button>
      </div>
      
      <div class="search-box">
        <div class="search-container">
          <input 
            type="text" 
            class="search-input" 
            placeholder="🔍搜索相关内容"
            v-model="searchQuery"
            @keyup.enter="performSearch"
          >
          <button class="search-btn" @click="performSearch">
            <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');

const handleBack = () => {
  router.go(-2);
};

const goHome = () => {
  router.push('/');
};

const performSearch = () => {
  if (searchQuery.value.trim()) {
    alert(`搜索: ${searchQuery.value}`);
  }
};
</script>

<style scoped lang="less">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6b5ce7 0%, #4ea1d3 100%);
  padding: 20px;
  font-family: 'Courier New', monospace;
}
.error-content {
  max-width: 800px;
  width: 100%;
  background: white;
  border: 4px solid #333;
  padding: 30px;
  box-shadow: 8px 8px 0 #000;
  text-align: center;
}

.error-code {
  font-size: 100px;
  font-weight: bold;
  color: #ff6b6b;
  line-height: 1;
  margin-bottom: 10px;
  text-shadow: 3px 3px 0 #000;
}
.error-message {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.error-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
}

.dino-animation {
  position: relative;
  height: 200px;
  margin: 40px auto;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  border-radius: 10px;
  background-color: #f8f9fa;
}

.dino {
  position: absolute;
  bottom: 30px;
  left: 50px;
  width: 50px;
  height: 50px;
  background-color: #4a5568;
  border-radius: 5px;
  z-index: 10;
  animation: dino-bounce 1s infinite alternate;
}

.ground {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30px;
  background: linear-gradient(to right, #8B4513, #A0522D);
  z-index: 5;
}

.cactus {
  position: absolute;
  bottom: 30px;
  right: -30px;
  width: 20px;
  height: 50px;
  background-color: #2E8B57;
  border-radius: 3px;
  animation: cactus-move 8s linear infinite;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
  
  .el-button {
    padding: 12px 30px;
    font-size: 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
  }
}

.search-box {
  max-width: 500px;
  margin: 30px auto 0;
  
  .search-container {
display: flex;
  width: 100%;
  height: 50px;
  background: white;
  border: 3px solid #333;
  overflow: hidden;
    
    .search-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 0 16px;
      font-size: 16px;
      color: #333;
      background: white;
      font-family: 'Courier New', monospace;
      
      &::placeholder {
        color: #999;
      }
    }
    
    .search-btn {
      width: 60px;
      background: #4285f4;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      
      &:hover {
        background: #3367d6;
      }
      
      .search-icon {
        color: white;
        font-size: 18px;
      }
    }
  }
}

@keyframes dino-bounce {
  0% { transform: translateY(0); }
  100% { transform: translateY(-20px); }
}

@keyframes cactus-move {
  0% { right: -30px; }
  100% { right: 100%; }
}

@media (max-width: 768px) {
  .error-content {
    padding: 30px 20px;
  }
  
  .error-code {
    font-size: 80px;
  }
  
  .error-message {
    font-size: 24px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 15px;
    
    .el-button {
      width: 100%;
    }
  }
  
  .dino-animation {
    height: 150px;
  }
  
  .search-box {
    max-width: 100%;
  }
}
</style>