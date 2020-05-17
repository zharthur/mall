import { debounce } from "./utils"

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    // let nrefresh = debounce(this.$refs.scroll.refresh, 50)
    // this.itemImgListener = () => {
    //   console.log('111');
    //   nrefresh()
    // }
    // this.$bus.$on('itemImageLoad', this.itemImgListener)
    const refresh = debounce(this.$refs.scroll.refresh, 50);
    this.itemImgListener = () => {
      // console.log("+++");
      refresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImgListener);

  }
}
// export default itemListenerMixin