# fvtt-twodsix-macros
Collection of macros for Foundry VTT Twodsix system

The macros right now are mainly for allowing you import content from books without much manual work.

# How to use it
The idea is simple:
- You screenshot/take a picture from the book you want to import the content from
- You load your LLM of choice and attach the image along with the reusable prompt
- You copy the Import macro into your FVTT world
- You replace the data array in the macro with teh output from the LLM and voiala

The macros by default will create the content in compendiums, you need to change the constants on the start of the macro to point to your own compendium
