import { Injectable, signal, computed } from '@angular/core';

export interface ServiceItem {
  id: number;
  iconClass: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  image?: string;
  bannerImageUrl?: string;
  contentSection1?: string;
  contentSection1Title?: string;
  contentSection2Title?: string;
  contentSection3Title?: string;
  contentSection4Title?: string;
  contentSection5Title?: string;
  contentSection6Title?: string;
  contentSection7Title?: string;
  contentSection1Body?: string;
  contentSection2Body?: string;
  contentSection3Body?: string;
  contentSection4Body?: string;
  contentSection5Body?: string;
  contentSection6Body?: string;
  contentSection7Body?: string;
  image1?: string;
  image2?: string;
  image3?: string;
  span1?: string;
  span2?: string;
  span3?: string;
  span4?: string;
  span5?: string;
  span6?: string;
  span7?: string;
  span8?: string;
  span9?: string;
  span10?: string;
  span11?: string;
  span12?: string;
  span13?: string;
  mainSpan1?: string;
  mainSpan2?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ServicesDataService {
  private servicesDataSource = signal<ServiceItem[]>([
    {
      id: 1,
      iconClass: 'fas fa-landmark',
      title: 'services.section1.title', //dddddddddddddd
      shortDescription: 'services.section1.span',
      bannerImageUrl: '/images/الشركات-التجارية.webp',
      contentSection1Title: 'services.section1.title2',
      contentSection1Body: 'services.section1.paragraph1',
      contentSection2Body: 'services.section1.paragraph2',
      image1: '/images/black-white-view-theatre.webp',
      image2: '/images/black-white-view-theatre.webp',
      image3: '/images/black-white-view-theatre.webp',
    },
    {
      id: 2,
      iconClass: 'fas fa-house-chimney',
      title: 'services.section2.title',
      shortDescription: 'services.section2.span',
      bannerImageUrl: '/images/الاستشارات-العقارية.webp',
      contentSection1Title: 'services.section2.title2',
      contentSection1Body: 'services.section2.paragraph1',
      contentSection2Body: 'services.section2.paragraph2',
      contentSection3Body: 'services.section2.paragraph3',
      image1: '/images/black-white-view-theatre.webp',
      image2: '/images/black-white-view-theatre.webp',
      image3: '/images/black-white-view-theatre.webp',
    },
    {
      id: 3,
      iconClass: 'fas fa-balance-scale',
      title: 'services.section3.title',
      shortDescription: 'services.section3.span',
      bannerImageUrl: '/images/نظام-العمل.webp',
      contentSection1Title: 'services.section3.title2',
      contentSection1Body: 'services.section3.paragraph1',
      span1: 'services.section3.span1',
      span2: 'services.section3.span2',
      span3: 'services.section3.span3',
      span4: 'services.section3.span4',
    },
    {
      id: 4,
      iconClass: 'fas fa-gavel',
      title: 'services.section4.title',
      shortDescription: 'services.section4.span',
      bannerImageUrl: '/images/القضايا.webp',
      contentSection1Title: 'services.section4.title2',
      contentSection1Body: 'services.section4.paragraph1',
      span1: 'services.section4.span1',
      span2: 'services.section4.span2',
      span3: 'services.section4.span3',
      span4: 'services.section4.span4',
      span5: 'services.section4.span5',
      span6: 'services.section4.span6',
      span7: 'services.section4.span7',
      span8: 'services.section4.span8',
      span9: 'services.section4.span9',
      span10: 'services.section4.span10',
    },
    {
      id: 5,
      iconClass: 'fas fa-coins',
      title: 'services.section5.title',
      shortDescription: 'services.section5.span',
      bannerImageUrl: '/images/اسواق-المال.webp',
      contentSection1Title: 'services.section5.title2',
      contentSection1Body: 'services.section5.paragraph1',
      span1: 'services.section5.span1',
      span2: 'services.section5.span2',
      span3: 'services.section5.span3',
      span4: 'services.section5.span4',
      span5: 'services.section5.span5',
      span6: 'services.section5.span6',
    },
    {
      id: 6,
      iconClass: 'fas fa-file-contract',
      title: 'services.section6.title',
      shortDescription: 'services.section6.span',
      bannerImageUrl: '/images/الدراسات.webp',
      contentSection1Body: 'services.section6.paragraph1',
      image1: '/images/black-white-view-theatre.webp',
      image2: '/images/black-white-view-theatre.webp',
      image3: '/images/black-white-view-theatre.webp',
      contentSection5Title: 'services.section6.title5',
      contentSection5Body: 'services.section6.paragraph5',
      contentSection6Title: 'services.section6.title6',
      contentSection6Body: 'services.section6.paragraph6',
      contentSection7Title: 'services.section6.title7',
      contentSection7Body: 'services.section6.paragraph7',
    },
    {
      id: 7,
      iconClass: 'fa-solid fa-people-roof',
      title: 'services.section7.title',
      shortDescription: 'services.section7.span',
      bannerImageUrl: '/images/الشركات-العائلية.webp',
      contentSection1Title: 'services.section7.title2',
      contentSection1Body: 'services.section7.paragraph1',
      contentSection2Body: 'services.section7.paragraph2',
    },
    {
      id: 8,
      iconClass: 'fas fa-handshake',
      title: 'services.section8.title',
      shortDescription: 'services.section8.span',
      bannerImageUrl: '/images/الاوقاف.webp',
      contentSection1Title: 'services.section8.title2',
      contentSection1Body: 'services.section8.paragraph1',
      contentSection2Body: 'services.section8.paragraph2',
      contentSection3Body: 'services.section8.paragraph3',
      image1: '/images/black-white-view-theatre.webp',
      image2: '/images/black-white-view-theatre.webp',
      image3: '/images/black-white-view-theatre.webp',
      mainSpan1: 'services.section8.mainSpan1',
      span1: 'services.section8.span1',
      span2: 'services.section8.span2',
      span3: 'services.section8.span3',
      span4: 'services.section8.span4',
      span5: 'services.section8.span5',
      span6: 'services.section8.span6',
      span7: 'services.section8.span7',
      mainSpan2: 'services.section8.mainSpan2',
      span8: 'services.section8.span8',
      span9: 'services.section8.span9',
      span10: 'services.section8.span10',
      span11: 'services.section8.span11',
      span12: 'services.section8.span12',
      span13: 'services.section8.span13',
    },
    {
      id: 9,
      iconClass: 'fas fa-book',
      title: 'services.section9.title',
      shortDescription: 'services.section9.span',
      bannerImageUrl: '/images/الضريبة-والزكاة.webp',
      contentSection1Title: 'services.section9.title2',
      contentSection1Body: 'services.section9.paragraph1',
      contentSection2Body: 'services.section9.paragraph2',
    },
  ]);

  public services = this.servicesDataSource.asReadonly();

  constructor() {}

  getServiceById(id: number): ServiceItem | undefined {
    return this.servicesDataSource().find((service) => service.id === id);
  }
}
