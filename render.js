const ipcRenderer = require("electron").ipcRenderer;

const run = () => {
  ipcRenderer.send("run", "hamza");
};

ipcRenderer.on("receive", (event, data) => {
  Object.keys(data).forEach((key) => {
    var ele = document.createElement("div");
    var title = document.createElement("a");
    title.innerText = key;
    title.href = data[key]["url"];

    var image = document.createElement("img");
    image.src = data[key]["img"];

    var price = document.createElement("span");
    price.innerText = data[key]["price"];
    ele.appendChild(image);
    ele.appendChild(title);
    ele.appendChild(price);
    // ele.innerHTML = data;
    document.body.appendChild(ele);
  });
});
