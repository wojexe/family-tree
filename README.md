# Family tree creator

This project was motivated by my having to create a family tree, but not wanting to spend lots of money of software dedicated to create ones. And also, I wanted to learn Svelte and have extensive customization options.

## How to use

The project is online at <https://family.wojexe.com>.

Here are some rules for adding people into the tree:

- Adding a person using the form, saves one's data in the memory
- To display the tree, it has to have a root - that's the first *marriage* that was created
- To ***marry*** two people
  - *You must have at least one non-married person in the memory*
  - *For a marriage to be displayed, exactly one of the married ones has to be a child of somebody else*
  1. Fill the form with person's data
  2. Pick a person you want current person to be married with, using the `Married with` field.
- To ***edit*** a person, just click on their card - a modal will appear, where you'll be able to change nearly every data field  
- To ***remove*** a person, enter the editing modal *(by clicking on the person's card)* and then click the delete button
  - Deleting a person with children, will also delete their children, but will not delete their spouse
  - **Behaviour of removing a person *(especially one with children / marriage)*, might not work properly sometimes - there are no guarantees, as there are no test yet.** *They'll be there, once I get the time to write them...*
- You can print the tree, using the browser's print menu. Even though it is possible, there are some caveats:
  - Printing in that manner only works with Chrome (maybe all Chromium)
  - You have to create a custom canvas for large trees - they will overflow the page if too large
  - **Sometimes the arrows might be misaligned, try refreshing the page** *(or do it a couple of times?)* **and then try printing again. If the bug persists - please create an issue, preferably with the exported tree pasted.**
- **Import / Export** a tree: this feature is not a great experince, but it works...
  - Exporting copies the tree's data to your clipboard
  - Importing opens an dialog, where you have to paste the contents of your keyboard - paste only previously exported data, otherwise, things ***will*** break
- The storage of the tree is persitent - tree will not disappear after a page refresh - you have to clean it using the button in the bottom left corner

## How to run

1. Clone the repository - `git clone https://github.com/wojexe/family-tree.git`
2. Install the necessary packages in the cloned project - `pnpm install`
3. Run it with `pnpm run dev`

## Credits

A big thanks to [anseki](https://github.com/anseki) for creating [LeaderLine](https://github.com/anseki/leader-line), which powers the generation of the arrows.

Another thank you to [MacFJA](https://github.com/MacFJA) for creating [svelte-persistent-store](https://github.com/MacFJA/svelte-persistent-store)
