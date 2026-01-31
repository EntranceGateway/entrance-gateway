import {
  HomeHero,
  HomePartners,
  HomeWhyChoose,
  HomeBrowseCategory,
  HomeSimpleSteps,
  HomeTestimonials,
  HomeLeadingCourses,
  HomeCTA,
  HomeNews,
} from './index'

export function HomePageContent() {
  return (
    <>
      <HomeHero />
      {/* <HomePartners /> */}
      <HomeWhyChoose />
      <HomeBrowseCategory />
      <HomeSimpleSteps />
      <HomeTestimonials />
      <HomeLeadingCourses />
      {/* <HomeCTA /> */}
      <HomeNews />
    </>
  )
}
