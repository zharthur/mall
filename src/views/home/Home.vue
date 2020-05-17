<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">商城</div>
    </nav-bar>
    <tab-control
      :titles="['流行','新款','精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      v-show="isTabFixed"
      class="tab-control"
    />
    <scroll
      class="content"
      ref="scroll"
      :probeType="3"
      @scroll="contentScroll"
      :pullUpLoad="true"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl" />
      <goods-list :goods="showGoods" class="goods" />
    </scroll>
    <!-- 组件不能直接监听原生事件，需要借助native -->
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import { getHomeMultidata, getHomeGoods } from "network/home";

import { debounce } from "common/utils";
import { itemListenerMixin } from "common/mixin";

export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  mixins: [itemListenerMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentIndex: 0,
      typeArray: ["pop", "new", "sell"],
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      positionY: 0,
      saveY: 0
    };
  },
  created() {
    //请求多个数据
    this.getHomeMultidata();

    //获取下面商品的数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  destroyed() {
    console.log("home destroyed");
  },
  activated() {
    this.$refs.scroll.refresh();
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
  },
  deactivated() {
    this.saveY = this.$refs.scroll.scroll.y;
    // this.saveY = this.positionY;

    //取消全局事件监听
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  mounted() {
    //使用mixins混入封装了
    // //监听goodsitem中图片加载完成
    // const refresh = debounce(this.$refs.scroll.refresh, 50);
    // this.$bus.$on("itemImageLoad", () => {
    //   // this.$refs.scroll.refresh();
    //   console.log("-----");
    //   // debounce(this.$refs.scroll.refresh, 50)();
    //   refresh();
    // });
  },
  computed: {
    showGoods() {
      return this.goods[this.typeArray[this.currentIndex]].list;
    }
  },
  methods: {
    //事件监听相关方法
    tabClick(index) {
      this.currentIndex = index;
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl.currentIndex = index;
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    contentScroll(position) {
      // console.log(position);
      // this.positionY = position.y;
      //1.判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000;

      //2.决定tabControl是否吸顶
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    loadMore() {
      this.getHomeGoods(this.typeArray[this.currentIndex]);

      // this.$refs.scroll.scroll.refresh();
    },
    swiperImageLoad() {
      //获取tacControl的offsetTop
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
    },
    // 网络请求相关方法
    getHomeMultidata() {
      //这里是自定义的方法名，下面相同的名字是调用的引用的方法
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        this.$refs.scroll.finishPullUp(); //完成本次上拉，实现多次加载更多
      });
    }
  }
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  /* vh视口 */
  height: 100vh;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /* 使用浏览器原生滚动时，为了让导航固定才设置的 */
  /* position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9; */
}
.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
}
.tab-control {
  position: relative;
  z-index: 90;
}
</style>