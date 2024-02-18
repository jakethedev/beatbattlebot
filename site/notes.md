# Code Structure

0. Adjust { ops, meta } import to static exported members instead of foreach
  - allows ops.cmd and meta.cmd autocomplete
  - may make slash commands easier to implement
1. `*controller`: need to abstract discord layer from logic
  - then use logic in server.js endpoints
2. Create folder for server endpoints, load each concretely in server.js
3. Test a serverless-offline deployment of server.js
  - will need a handler per function? or is handler at /* sufficient?
  - less is more here, /* should work if possible
  - TODO: authentication for routes via... firebase? discord oauth?

# UI Design Notes

UI fw: React? Svelte?
Style: daisyUI (winter, night themes) using TailwindCSS
