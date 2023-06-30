export const getWeatherUrl: any = (name:string, suffix: string) => {
  let path0 = ''
  const modules:any = import.meta.glob("/src/assets/weather/*.png");
  // console.log(modules,'modules')
  for (const path in modules) {
    modules[path]().then((mod:any) => {
      if (path === `/src/assets/img/${name}.${suffix}`) { 
        path0 = mod.default
      }
    })
  }
  return path0
  // return new URL(path, import.meta.url).href
};
