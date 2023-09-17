import { shallowMount } from "@vue/test-utils";
import Home from "@/views/HomeView.vue";
import SongItem from "@/components/SongItem.vue";

jest.mock("@/includes/firebase", () => {});

describe("Home.vue", () => {
  test("renders list of songs", () => {
    const songs = [{}, {}, {}];

    Home.methods.getSongs = () => false;

    const component = shallowMount(Home, {
      data() {
        return {
          songs,
        };
      },
      global: {
        mocks: {
          $t: (message) => message,
        },
      },
    });

    const items = component.findAllComponents(SongItem);

    expect(items).toHaveLength(songs.length);

    items.forEach((wrapper, i) => {
      // expect(wrapper.props().song).toBe(songs[i]); // as per trainer, but generates and error on my side
      expect(wrapper.props().song).toStrictEqual(songs[i]); // changed the function as suggested in the test console
    });
  });
});
