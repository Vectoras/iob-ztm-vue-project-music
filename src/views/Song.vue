<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          id="play-button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
          @click.prevent="soundAction"
        >
          <i class="fas" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-price">{{ $n(1, "currency") }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">
            {{ $tc("song.comment_count", song.comment_count, { count: song.comment_count }) }}
          </span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            v-if="comment_show_alert"
            class="text-white text-center fong-bold p-4 mb-4"
            :class="comment_alert_variant"
          >
            {{ comment_alert_message }}
          </div>
          <vee-form v-if="userLoggedIn" :validation-schema="schema" @submit="addComment">
            <vee-field
              name="comment"
              as="textarea"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <ErrorMessage class="text-red-600" name="comment" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="comment_in_submission"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            v-model="sort"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        v-for="comment in sortedComments"
        :key="comment.docID"
        class="p-6 bg-gray-50 border border-gray-200"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time> {{ comment.datePosted }} </time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
  import { songsCollection, commentsCollection, auth } from "@/includes/firebase";
  import { mapState, mapActions, mapGetters } from "vuex";

  export default {
    name: "SongView",
    data() {
      return {
        song: {},
        comments: [],
        schema: {
          comment: "required|min:3",
        },
        sort: "1",
        comment_in_submission: false,
        comment_show_alert: false,
        comment_alert_variant: "bg-blue-500",
        comment_alert_message: "Please Wait! Your comment is being submitted",
      };
    },
    computed: {
      ...mapState(["userLoggedIn", "currentSong"]),
      ...mapState({
        userLoggedIn: (state) => state.auth.userLoggedIn,
        currentSong: (state) => state.player.currentSong,
      }),
      ...mapGetters(["playing"]),
      sortedComments() {
        return this.comments.slice().sort((a, b) => {
          if (this.sort === "1") {
            return new Date(b.datePosted) - new Date(a.datePosted);
          } else {
            return new Date(a.datePosted) - new Date(b.datePosted);
          }
        });
      },
    },
    methods: {
      ...mapActions(["newSong", "toggleAudio"]),
      async addComment(values, { resetForm }) {
        this.comment_in_submission = true;
        this.comment_show_alert = true;
        this.comment_alert_variant = "bg-blue-500";
        this.comment_alert_message = "Please Wait! Your comment is being submitted";

        const comment = {
          content: values.comment,
          datePosted: new Date().toString(),
          sid: this.$route.params.id,
          name: auth.currentUser.displayName,
          uid: auth.currentUser.uid,
        };

        await commentsCollection.add(comment);

        this.song.comment_count += 1;
        await songsCollection.doc(this.$route.params.id).update({
          comment_count: this.song.comment_count,
        });

        this.comment_in_submission = false;
        this.comment_alert_variant = "bg-green-500";
        this.comment_alert_message = "Comment Added!";

        resetForm();
        this.getComments();
      },
      async getComments() {
        const snapshots = await commentsCollection.where("sid", "==", this.$route.params.id).get();

        this.comments = [];

        snapshots.forEach((doc) => {
          this.comments.push({
            docID: doc.id,
            ...doc.data(),
          });
        });
      },
      soundAction() {
        if (this.song === this.currentSong) this.toggleAudio();
        else this.newSong(this.song);
      },
    },
    watch: {
      sort(newVal) {
        if (newVal === this.$route.query.sort) return;

        this.$router.push({
          query: {
            sort: newVal,
          },
        });
      },
    },
    async beforeRouterEnter(to, from, next) {
      const docSnapshot = await songsCollection.doc(to.params.id).get();

      next((vm) => {
        if (!docSnapshot.exists) {
          this.$router.push({ name: "home" });
          return;
        }

        const { sort } = vm.$route.query;
        if (sort === "1" || sort === "2") vm.sort = sort; // my solution -> does not trigger the watcher if query missing + default value needs updating only in data()
        // vm.sort = sort === "1" || sort === "2" ? sort : "1"; // trainer solution

        vm.song = docSnapshot.data();
        vm.getComments();
      });
    },
  };
</script>
