import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products = [
    {
      id: 'T300-HP-01',
      name: 'Turbo Compressor T300 Alta performance',
      price: 3890.0,
      img: 'assets/img/turbo.png',
      brand: 'ForjadoParts',
      description:
        'O Turbo Compressor T300 é a escolha definitiva para quem busca performance extrema...',
      specs: [
        { label: 'Material', value: 'Aço Inox Forjado' },
        { label: 'Garantia', value: '12 meses' },
      ],
      category: 'Motor',
    },
    {
      id: 'PA-CE-04',
      name: 'Pastilha de Freio Cerâmica XPT',
      price: 450.9,
      img: 'assets/img/pastilha.png',
      brand: 'StopTech',
      description: 'Pastilhas de freio de cerâmica para alta performance...',
      specs: [
        { label: 'Composto', value: 'Cerâmica' },
        { label: 'Vida Útil', value: '30.000 km' },
      ],
      category: 'Freio',
    },
    {
      id: 'AM-ES-ADJ',
      name: 'Amortecedor Esportivo Ajustável',
      price: 980.0,
      img: 'assets/img/amortecedor.png',
      brand: 'ProRace',
      description:
        'Amortecedores esportivos com regulagem de altura e rigidez, ideais para personalizar a suspensão do seu carro para pista ou rua.',
      specs: [
        { label: 'Tipo', value: 'Coilover Ajustável' },
        { label: 'Regulagens', value: 'Altura e Dureza (32 Posições)' },
        { label: 'Material', value: 'Alumínio Forjado' },
        { label: 'Garantia', value: '6 meses' },
      ],
      category: 'Suspensão',
    },
    {
      id: 'OL-5W40-PERF',
      name: 'Óleo Sintético 5W40 Performance',
      price: 89.9,
      img: 'assets/img/oleo.png',
      brand: 'Motul',
      description:
        'Óleo 100% sintético de alta performance 5W40, projetado para motores modernos. Oferece proteção superior contra o desgaste e otimiza a performance em condições extremas.',
      specs: [
        { label: 'Tipo', value: 'Sintético' },
        { label: 'Viscosidade', value: '5W40' },
        { label: 'Padrões', value: 'API SN, ACEA A3/B4' },
        { label: 'Volume', value: '1 Litro' },
      ],
      category: 'Motor',
    },
    {
      id: 'FA-LED-PROJ',
      name: 'Farol LED Projetor Tuning XENON',
      price: 1250.0,
      img: 'assets/img/farol.png',
      brand: 'LightForce',
      description:
        'Farol LED com projetor e efeito Tuning XENON, proporciona iluminação superior e um visual agressivo para seu veículo.',
      specs: [
        { label: 'Tecnologia', value: 'LED + Projetor' },
        { label: 'Cor da Luz', value: '6000K (Branco Frio)' },
        { label: 'Funcionalidades', value: 'DRL, Setas Sequenciais' },
        { label: 'Instalação', value: 'Plug & Play (em modelos compatíveis)' },
      ],
      category: 'Iluminação',
    },
    {
      id: 'VE-IRI-COMP',
      name: 'Velas de Ignição Iridium Competição',
      price: 210.0,
      img: 'assets/img/vela.png',
      brand: 'NGK',
      description:
        'Velas de ignição de Iridium para competição e alta performance. Melhoram a partida, a resposta do acelerador e a queima de combustível.',
      specs: [
        { label: 'Material do Eletrodo', value: 'Iridium' },
        { label: 'Tipo', value: 'Competição' },
        { label: 'Benefícios', value: 'Partida Rápida, Maior Durabilidade' },
        { label: 'Pacote', value: 'Conjunto com 4 Velas' },
      ],
      category: 'Motor',
    }
  ];

  getProducts() {
    return this.products;
  }

  getProductById(id: string) {
    return this.products.find((p) => p.id === id);
  }
}
