<template>
  <div class="server-mgmt">
    <router-link :to="{name: 'index'}"><cube-button :primary="true">返回Home</cube-button></router-link>
    <cube-button @click="getJsonData">请求JSON</cube-button>
    <cube-input v-model="params.id" ></cube-input>
    <cube-button :primary="true" @click="getStoryList">请求StoryList接口</cube-button>
    <cube-button @click="showAddForm = true">添加StoryItem</cube-button>
    <div v-show="showAddForm" class="add-form">
      <cube-form :model="model">
        <cube-form-group>
          <cube-form-item :field="fields[0]"></cube-form-item>
          <cube-form-item :field="fields[1]"></cube-form-item>
          <cube-form-item :field="fields[2]"></cube-form-item>
          <cube-form-item :field="fields[3]"></cube-form-item>
        </cube-form-group>
        <cube-form-group>
          <cube-button :inline="true" :outline="true" @click="showAddForm = false">取消</cube-button>
          <cube-button :inline="true" @click="submitHandler">确定</cube-button>
        </cube-form-group>
      </cube-form>
    </div>
    <div class="swipe-wrapper">
      <cube-scroll>
        <cube-swipe>
          <ul>
            <li class="swipe-item-wrapper" v-for="(item, index) in storyList" :key="index">
              <cube-swipe-item
                  ref="swipeItem"
                  :index="index">
                <div class="item-inner">
                  <div class="icon">
                    <img width="60" height="60" :src="item.url">
                  </div>
                  <div class="text">
                    <h2 class="item-name" v-html="item.title"></h2>
                    <p class="item-desc" v-html="item.details"></p>
                  </div>
                </div>
              </cube-swipe-item>
            </li>
          </ul>
        </cube-swipe>
      </cube-scroll>
    </div>
  </div>
</template>

<script>
import Json from '@/api/json'
import Server from '@/api/server'
import axios from 'axios'
export default {
  data () {
    return {
      params: {
        id: 0
      },
      showAddForm: false,
      model: {
        id: '',
        title: '',
        url: 'https://f11.baidu.com/it/u=2754208607,630952272&fm=72',
        details: ''
      },
      fields: [
        {
          type: 'input',
          modelKey: 'id',
          label: 'ID',
          props: {
            placeholder: '请输入'
          },
          rules: {
            required: true
          }
        },
        {
          type: 'input',
          modelKey: 'title',
          label: '标题',
          props: {
            placeholder: '请输入'
          },
          rules: {
            required: true
          }
        },
        {
          type: 'input',
          modelKey: 'url',
          label: '图片地址',
          props: {
            placeholder: '请输入'
          },
          rules: {
            required: true
          }
        },
        {
          type: 'input',
          modelKey: 'details',
          label: '详情',
          props: {
            placeholder: '请输入'
          },
          rules: {
            required: true
          }
        }
      ],
      storyList: []
    }
  },
  methods: {
    getJsonData () {
      Json.dataMgmt()
      .then((res) => {
        console.log(res)
      })
    },
    getStoryList () {
      let url = `/api/server/storyList`
      let id = this.params.id
      if (id) {
        url = `/api/server/storyList?id=${id}`
      }
      axios.get(url)
      .then(res => {
        this.storyList = res.data.data
      })
    },
    submitHandler () {
      console.log(this.model);
      axios.post('/api/server/storyList/add', this.model)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  },
  mounted () {
    this.getStoryList();
  }
}
</script>

<style lang="scss">
.server-mgmt {
  .add-form {
      padding: 10px 0;
      border-bottom: 50px solid #4a4c5b;
    }
  .swipe-wrapper{
    .item-inner{
        display: flex;
        position: relative;
        height: 60px;
        .item-name {
          position: relative;
        }
        .item-desc {
          position: absolute;
          bottom: 0;
        }
    }
  }
}
</style>
