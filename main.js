                                                                                                                                                                                                                                                            
var FU = []
if (!localStorage.getItem("FU")) {
  console.log("Welcome")
  localStorage.setItem("FU", JSON.stringify(FU))
} else {
  console.log("Welcome Back")
  var FUX = JSON.parse(localStorage.getItem("FU"));
  console.log(FUX)
  DisplayFU()
}

const listGrupTempt = document.getElementById("list_grup")
const listBarang = document.getElementById("list_brg")               

const clone = listBarang.cloneNode(true)
document.getElementById("add-list").onclick = function(){
  const pasteClone = clone.cloneNode(true)
  listBarang.appendChild(pasteClone)
  
  numberChange()

  document.querySelectorAll("button.delete-list").forEach(del =>{
    del.onclick = () => {
      del.parentElement.remove()
      console.log('ben')
      numberChange()
      countAll()
    }
  })
}

let total_All

function calculte(){
  let harga = document.querySelectorAll("input.value")
  let qty = document.querySelectorAll("input.qty")
  let total = document.querySelectorAll("input.tot-hrg")
  
  total.forEach((ttl,i) => {
    let qtys = 0
    let hrg = 0
    if(harga[i].value > 0 ) {
      hrg = harga[i].value
    }
    if(qty[i].value > 0) {
      qtys = qty[i].value
    }
    ttl.value = "Rp. " + (hrg*qtys).toLocaleString()
    ttl.dataset.value = hrg*qtys
  })
}

function countAll() {
  let total = document.querySelectorAll("input.tot-hrg")
  let totals = 0
  total.forEach(tot =>{
    if(tot.dataset.value >= 1) totals += parseFloat(tot.dataset.value)
  })
  total_All = parseFloat(totals)
  console.log(totals)
  document.querySelector("#total_semua").innerHTML = "Rp. " + total_All.toLocaleString()
}


function numberChange(){
document.querySelectorAll("input.value").forEach(hrg => {
  hrg.onkeyup = () => {
    hrg.dataset.val = hrg.value
    calculte()
    countAll()
    console.log("change")
  }
})
document.querySelectorAll("input.qty").forEach(qty =>{
  qty.onkeyup = () => {
    calculte()
    countAll()
  }
})
}

numberChange()

function save(param){
  
  const namaCust = document.querySelector("#nama_cust").value
  const telpon = document.querySelector("#telp").value
  const alamat = document.querySelector("#alamat").value
  const color = document.querySelector("#warna").value
  const atTx = document.querySelector("#at_tx").value
  const note = document.querySelector("#note").value
  
  var tel = true;
  function toIf(param, type) {
    if (!param) {
      alert(type + " Kosong")
      tel = false
    }
  }
  
  toIf(namaCust, "Nama Cust")
  toIf(telpon, "Nomor HP/Telepon Cust")
  
  //toIf(alamat, "alamat")
  toIf(color, "Pilihan Warna")
  toIf(atTx, "Estimasi Transaksi")
  toIf(note, "Catatan")
  
  if (!tel) return
  
  let articles = document.querySelectorAll("input.artikel")
  let nama_brg = document.querySelectorAll("input.nama_brg")
  let values = document.querySelectorAll("input.value")
  let qty = document.querySelectorAll("input.qty")
  
  let empty = false
  let i = -1
  articles.forEach((code,x) => {
    if(!code.value) {
      empty = true
      if(i == -1) i = x
    }
  })
  
  if(empty) {
    articles[i].focus()
    alert("Artikel atau nama barang kosong")
    return
  }
  var today = new Date(); var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd; 

  
  var basicFU = {
    nama_cust : namaCust,
    telp : telpon,
    alm : alamat,
    barangs : [],
    total : total_All,
    ATTrx : atTx,
    notes : note,
    colors : color,
    status: "Proses",
    setIn : today
  }


  articles.forEach((code,i) =>{
    var basicBarang = {
      ID : articles[i].value,
      nama_brg : nama_brg[i].value,
      harga : values[i].value,
      jumlah : qty[i].value
    }
    basicFU.barangs.push(basicBarang)
  })
  
  console.log(atTx.value)
  
  if(basicFU.barangs.length == 0) {
    alert("Tambahkan Barang")
    return
  }
  
  let proses = param.dataset.proses
  let FUX = JSON.parse(localStorage.getItem("FU"))
  
  if(proses == "save") {
    if (confirm("Simpan ?") == true) {
    
      FUX.push(basicFU)
    
      localStorage.setItem("FU", JSON.stringify(FUX))
      alert("Data Saved")
      location.reload()
    }
  } else {
    if(confirm("Ubah ?") == true){
      let i = parseInt(proses)
      FUX[i] = basicFU
      localStorage.setItem("FU", JSON.stringify(FUX))
      alert("Data Changed")
      location.reload()
    }
  }
  
  listCtrl()
}


// list barangs control
function listCtrl() {
  document.querySelectorAll("i.fa-list").forEach(lst => {
    lst.addEventListener("click", function() {
      var show = this.getAttribute("data-show")
      if (show == "true") {
        this.nextElementSibling.style.display = "none"
        this.setAttribute("data-show", "")
        this.classList.remove("on")
      } else {
        this.nextElementSibling.style.display = "block"
        this.setAttribute("data-show", "true")
        this.classList.add("on")
      }
    })
  })
}



// hide add
function fuControl(ctrl){
  let add = document.querySelector("#addForm")
  let control = ctrl.dataset.control
  if(control == "off") {
    ctrl.dataset.control = "on"
    ctrl.classList.remove("fa-plus")
    ctrl.classList.add("fa-window-close")
    add.style.display = "block"
    console.log("on")
  } else {
    ctrl.dataset.control = "off"
    ctrl.classList.add("fa-plus")
    ctrl.classList.remove("fa-window-close")
    add.style.display = "none"
  }
}


// tampilkan data

function DisplayFU() {
  const FUX = JSON.parse(localStorage.getItem("FU"))
  let toShow = "";
  if(FUX.length == 0) return
  FUX.forEach((fu,i) => {
    let telpon = fu.telp
    if(telpon[0] == "0"){
      let tp = telpon.slice(1)
      telpon = "+62".concat(tp)
    }
    let barangss = ""
    fu.barangs.forEach(brg =>{
      let tempt = `
        <p>${brg.ID} | ${brg.nama_brg}<br>Rp. ${brg.harga.toLocaleString()} x ${brg.jumlah} => Rp. ${(parseFloat(brg.harga)*parseInt(brg.jumlah)).toLocaleString()}</p>
      `
      barangss += tempt
    })
    let temp = `
    <div class="box" data-index="${i}" data-nama="${fu.nama_cust}" data-alamat="${fu.alm}" data-colors="${fu.colors}" data-dateIn="${fu.setIn}" data-dateOut="${fu.ATTrx}">
      <div class="list">
        <div class="list-left">
          <h4>${fu.nama_cust}</h4>
          <p class="fu_telp">${fu.telp}</p>
        </div>
        <div class="list-right">
          <i>${fu.ATTrx}</i>
          <span>Rp. ${fu.total.toLocaleString()}</span>
          <span>${fu.barangs.length} Barang</span>
        </div>
      </div>
      <div class="list-2">
        <h6>${fu.alm}</h6>
        <p>Note :</p>
        <p>${fu.notes}</p>
      </div>
      <div class="list-3" data-color="${fu.colors}">
        <a href="tel: ${fu.telp}"><i class="fas fa-phone"></i></a>
        <a href="https://wa.me/${telpon}"><i class="fab fa-whatsapp"></i></a>
        <i class="fa fa-pencil" onclick="edit(${i})"></i>
        <i class="fa fa-trash" onclick="hapus(${i})"></i>
        <i class="fa fa-check" onclick="done(${i})"></i>
        <i data-show="false" class="fa fa-list"></i>
        <div class="list-barangs">
          ${barangss}
        </div>
      </div>
    </div>
    `;
    toShow += temp
    document.querySelector("#FUX_List").innerHTML = toShow
  
    listCtrl()
    document.querySelectorAll(".box").forEach(box =>{
      console.log(box.dataset.dateIn)
    })
  })
}



/*
window.addEventListener("click", function(clicked) {
  console.log(clicked.target)
  const theList = document.querySelector(".fa-list").dataset.show
  console.log(theList)
  if(!clicked.target.matches(".list-barangs") && theList == "true"){
    document.querySelector(".list-barangs").style.display = "none"
  }
})
*/


//format telp to WhatsApp

document.querySelector("#telp").onkeyup = function(){
  let value = this.value
  console.log(value)
  if(this.value[0] != "0" || this.value[1] != "8"){
    this.value = '08'
    return alert("Gunakan Format 08xxx")
  }
  if(value.length <= 12) {
    this.dataset.value = this.value
  }
  if(this.value.length > 12 ) {
    this.value = this.dataset.value
  }
}


// edit data
function edit(param){
  
  if (!confirm("Ingin Edit Data ?")) return
  
  const FUX = JSON.parse(localStorage.getItem("FU"))
  
  let toEdit = FUX[param]
  
  document.querySelector("#nama_cust").value = toEdit.nama_cust
  document.querySelector("#telp").value = toEdit.telp
  document.querySelector("#alamat").value = toEdit.alm
  document.querySelector("#warna").value = toEdit.colors
  document.querySelector("#at_tx").value = toEdit.ATTrx
  document.querySelector("#note").value = toEdit.notes
  
  let barangsx = ""
  toEdit.barangs.forEach(brg => {
      let tempt = `
        <div class="list_grup" id="list_grup">
          <hr>
          <input type="text" class="artikel" placeholder="Artikel" style="width: 100px;" value="${brg.ID}">
          <input type="text" class="nama_brg" placeholder="Nama" style="width: 265px;" value="${brg.nama_brg}"><br>
          <input type="number" class="value" placeholder="Harga" style="width: 100px" min="0" step="any" value="${brg.harga}">
          <input type="number" class="qty" placeholder="Quantity" style="width: 70px;" value="${brg.jumlah}">
          <input type="" class="tot-hrg" placeholder="Total" readonly style="width: 175px;">
          <button class="delete-list"><i class="fas fa-trash"></i></button>
        </div>
        `
      barangsx += tempt
      
  })
  document.querySelector("#list_brg").innerHTML = barangsx
  numberChange()
  calculte()
  countAll()
  document.querySelector("#add").dataset.proses= param
  document.querySelector("#reset").style.display = ""
}

function hapus(param) {
  if(!confirm("Hapus data ini ?")) return
  
  let FUX = JSON.parse(localStorage.getItem("FU"))
  FUX.splice(parseFloat(param),1)
  localStorage.setItem("FU", JSON.stringify(FUX))
  location.reload()
}





function colorings(){
  document.querySelectorAll(".list-3").forEach(tiga => {
    tiga.style.backgroundColor = tiga.dataset.color
  })
}
colorings()

function done(param){
  if(!confirm("FU sukses ??")) return
  
  let FUX = JSON.parse(localStorage.getItem("FU"))
  FUX[parseFloat(param)].status = "Sukses"
  localStorage.setItem("FU", JSON.stringify(FUX))
  alert("Great Job !!")
  location.reload()
}



document.querySelectorAll("input[type=date").forEach(input => {
  var today = new Date();
  var d = String(today.getDate()).padStart(2, '0');
  var m = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var y = today.getFullYear();
  return input.value = y + '-' + m + '-' + d;
})


const searchTab = document.querySelectorAll(".tab-1 i")
const searchItem = document.querySelectorAll(".tab-2 .tabs")
searchTab.forEach((tab,i) => {
  tab.addEventListener("click", function (){
    searchTab.forEach(tabs =>{
      tabs.classList.remove("on")
    })
    this.classList.add("on")
    searchItem.forEach(item => {
      if(item.dataset.show == tab.dataset.show) {
        item.style.display = "flex"
      } else {
        item.style.display = "none"
      }
    })
    if(tab.dataset.show == "all") {
      document.querySelectorAll(".box").forEach(box => {
        box.style.display = "block"
      })
    }
  })
})


function setColor (){
  const FUX = JSON.parse(localStorage.getItem("FU"))
  const getColor = FUX.map(color => {
    return color.colors
  })
  const uniqueColor = [...new Set(getColor)]
  let colHTML = ""
  uniqueColor.forEach(col => {
    let tempt = `
      <div class="colors" data-color="${col}"></div>
    `
    colHTML += tempt
  })
  document.querySelector("#colorers").innerHTML = colHTML
  const boxes = document.querySelectorAll(".box")
  let colorers = document.querySelectorAll("#colorers .colors")
  colorers.forEach(col =>{
    col.style.backgroundColor = col.dataset.color
    col.onclick = function (){
      colorers.forEach(co => {
        co.classList.remove("on")
      })
      col.classList.add("on")
      boxes.forEach(box => {
        if(box.dataset.colors == col.dataset.color) return box.style.display = "block"
        box.style.display = "none"
      })
    }
  })
}
setColor()

function searchUser (){
  const user = document.querySelector("input#search-nama")
  user.addEventListener("keyup", function () {
    const value = this.value.toUpperCase()
    document.querySelectorAll(".box").forEach(box => {
      const nama = box.dataset.nama.toUpperCase()
      const alamat = box.dataset.alamat.toUpperCase()
      if(nama.indexOf(value) >= 0) return box.style.display = "block"
      if(alamat.indexOf(value) >= 0) return box.style.display = "block"
      box.style.display = "none"
    })
    //console.log(value)
  })
}
searchUser()

function searchBarang () {
  const goods = document.querySelector("input#search-barang")
  const search = document.querySelector("button#search-goods")
  const boxs = document.querySelectorAll(".box")
  const FUX = JSON.parse(localStorage.getItem("FU"))
  search.addEventListener("click", function () {
    let value = goods.value.toUpperCase()
    
    let array = []
    FUX.forEach((item, i) => {
      item.barangs.forEach(brg => {
        const id = brg.ID.toUpperCase()
        const nama = brg.nama_brg.toUpperCase()
        //console.log(i)
        if(id.indexOf(value) >= 0) return array.push(i)
        if(nama.indexOf(value) >= 0) return array.push(i)
      })
    })
    //console.log(array)
    if(!array.length > 0) {
      boxs.forEach(box => {
        box.style.display = "none"
      })
      return alert("Data Tidak Ditemukan !!")
    }
    boxs.forEach(box => {
      let check = array.some(it => {
        console.log(it)
        return it == box.dataset.index
      })
      console.log(check)
      if(check) {
        box.style.display = "block"
      } else {
        box.style.display = "none"
      }
    })
  })
}
searchBarang()

function calendarSearch() {
  From.addEventListener("change", function () {
    const From = document.querySelector("input#From")
    const To = document.querySelector("input#To")
    const formValue = new Date(From.value)
    const toValue = new Date(To.value)
    if(formValue > toValue) {
      From.value = To.value
      return alert("Tanggal Salah !!")
    }
  })
  To.addEventListener("change", function () {
    const From = document.querySelector("input#From")
    const To = document.querySelector("input#To")
    
    const formValue = new Date(From.value)
    const toValue = new Date(To.value)
    if(formValue > toValue) {
      To.value = From.value
      return alert("Tanggal Salah !!")
    }
  })
  document.querySelector("button#search-date").addEventListener("click", function () {
    const From = document.querySelector("input#From")
    const To = document.querySelector("input#To")
    
    const formValue = new Date(From.value)
    const toValue = new Date(To.value)
    if (formValue > toValue) return alert("Tanggal Salah !!")
    
    let decide = ""
    document.getElementsByName("dateOf").forEach(radio => {
      if(radio.checked) return decide = radio.value
    })
    
    document.querySelectorAll(".box").forEach(boxses => {
      const dateIn = boxses.getAttribute("data-dateIn")
      const dateOut = boxses.getAttribute("data-dateOut")
      let param = ""
      if(decide == "in") param = dateIn
      if(decide == "out") param = dateOut
      console.log(decide, param)
      param = new Date (param)
      let ffrom = new Date(From.value)
      let tto = new Date(To.value)
      if(param >= ffrom && param <= tto) return boxses.style.display = "block"
      return boxses.style.display = "none"
    })
    
  })
}

calendarSearch()
