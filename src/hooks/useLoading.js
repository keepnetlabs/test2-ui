export const useLoading = {
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    setLoading(flag = false) {
      this.isLoading = flag
    }
  }
}
