### Hi there 👋

<!--
**burhoniddinoff/burhoniddinoff** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.

Here are some ideas to get you started:

- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...
-->


name: Waka Readme

on:
  # for manual workflow trigger
  workflow_dispatch:
  schedule:
    # runs at 12 AM UTC (5:30 AM IST)
    - cron: "0 0 * * *"

jobs:
  update-readme:
    name: WakaReadme DevMetrics
    runs-on: ubuntu-latest
    steps:
      - uses: athul/waka-readme@master # this action name
        with:
          WAKATIME_API_KEY: ${{ waka_6795c500-052c-460a-8a22-9464e9448c60 }}
