class App {
  constructor() {
    this.clearButton = document.getElementById("clear-btn");
    this.loadButton = document.getElementById("load-btn");
    this.carContainerElement = document.getElementById("cars-container");
    this.tipe = document.getElementById("tipe");
    this.tanggal = document.getElementById("tanggal");
    this.waktu = document.getElementById("waktu");
    this.jumlahpenumpang = document.getElementById("jumlahpenumpang");
  }

  async init() {
    await this.load();
    this.run();
  }

  run = () => {
    Car.list.forEach((car) => {
      const node = document.createElement("div");
      node.classList.add("col-lg-4", "my-2");
      node.innerHTML = car.render();
      this.carContainerElement.appendChild(node);
    });
  };

  async load() {
    const cars = await Binar.listCars();
    Car.init(cars);
    console.log(cars);
  }

  async loadFilter() {
    const cars = await Binar.listCars((data) => {
      const tanggalJemputData = new Date(data.availableAt).getTime();
      const tanggal = new Date(
        `${this.tanggal.value} ${this.waktu.value}`
      ).getTime();
      const checkWaktu = tanggalJemputData >= tanggal;
      const availableAt =
        this.tipe.value === "true" && data.available ? true : false;
      const notAvailableAt =
        this.tipe.value === "false" && !data.available ? true : false;
      const penumpang = data.capacity >= this.jumlahpenumpang.value;
      if (
        this.tipe.value !== "default" &&
        this.tanggal.value !== "" &&
        this.waktu.value !== "false" &&
        this.jumlahpenumpang.value >= 0
      ) {
        return (availableAt || notAvailableAt) && checkWaktu && penumpang;
      } else if (
        this.tipe.value !== "default" &&
        this.jumlahpenumpang.value > 0
      ) {
        return (availableAt || notAvailableAt) && penumpang;
      } else if (
        this.tanggal.value !== "" &&
        this.waktu.value !== "false" &&
        this.jumlahpenumpang.value > 0
      ) {
        return checkWaktu && penumpang;
      } else if (this.tanggal.value !== "" && this.waktu.value !== "false") {
        return checkWaktu;
      } else if (this.tipe.value !== "default") {
        return availableAt || notAvailableAt;
      } else {
        return penumpang;
      }
    });
    console.log(cars);
    Car.init(cars);
  }

  clear = () => {
    let child = this.carContainerElement.firstElementChild;

    while (child) {
      child.remove();
      child = this.carContainerElement.firstElementChild;
    }
  };
}
