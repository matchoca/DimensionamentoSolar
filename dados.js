const modulosDB = [
    { id: 1, marca: "ASTRONERGY", modelo: "CHSM72N(DG)F-BH-575W", potencia: 575, vmppt: 42.94, imppt: 13.39, voc: 51.10, isc: 14.19 }
];

const inversoresDB = [
    {id: 1, marca: "DEYE", modelo: "SUN-5K-G05P1-EU-AM", potenciaNominal: 5, maxInput: 7.5, vInMax: 550, iInMax: 27, iOut: 25}
];

const irradianciaMensal = [
  { mes: "Jan", valor: 6.34 },
  { mes: "Fev", valor: 5.78 },
  { mes: "Mar", valor: 4.81 },
  { mes: "Abr", valor: 3.79 },
  { mes: "Mai", valor: 2.78 },
  { mes: "Jun", valor: 2.32 },
  { mes: "Jul", valor: 2.52 },
  { mes: "Ago", valor: 3.20 },
  { mes: "Set", valor: 3.58 },
  { mes: "Out", valor: 4.73 },
  { mes: "Nov", valor: 6.19 },
  { mes: "Dez", valor: 6.63 },
];

const irradianciaMedia =
irradianciaMensal.reduce((soma, mes) => soma + mes.valor, 0) /
irradianciaMensal.length;

function carregarModulos() {
  const select = document.getElementById('select-modulo');
  if (!select) return;

  select.innerHTML = "";

  const placeholder = document.createElement('option');
  placeholder.text = 'Selecione o módulo';
  placeholder.disabled = true;
  placeholder.selected = true;
  select.appendChild(placeholder);

  modulosDB.forEach(modulo => {
    const option = document.createElement('option');
    option.value = modulo.id;
    option.text = `${modulo.potencia}W - ${modulo.marca} - ${modulo.modelo}`;
    select.appendChild(option);
  });
}

function carregarInversores() {
  const select = document.getElementById('select-inversor');
  if (!select) return;

  select.innerHTML = "";

  const placeholder = document.createElement('option');
  placeholder.text = 'Selecione o inversor';
  placeholder.disabled = true;
  placeholder.selected = true;
  select.appendChild(placeholder);

  inversoresDB.forEach(inv => {
    const option = document.createElement('option');
    option.value = inv.id;
    option.text = `${inv.potenciaNominal}kW - ${inv.marca} - ${inv.modelo}`;
    select.appendChild(option);
  });
}