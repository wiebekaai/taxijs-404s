import { Core, Renderer, Transition } from "@unseenco/taxi";

new Core({
  renderers: {
    default: class extends Renderer {
      onEnterCompleted() {
        // remove old content
        [...this.wrapper.querySelectorAll("[data-taxi-view]")]
          .filter((e) => e !== this.content)
          .forEach((e) => e.remove());
      }
    },
  },
  transitions: {
    default: class extends Transition {
      async onEnter({ done }) {
        // animating stuff
        await new Promise((resolve) => setTimeout(resolve, 1000));

        done();
      }

      async onLeave({ done }) {
        // animating stuff
        await new Promise((resolve) => setTimeout(resolve, 1000));

        done();
      }
    },
  },
  removeOldContent: false,
  bypassCache: true,
});
