class StringFormatter {
  capitalizeFirstLetter([first, ...rest]: string) {
    const restLowerCase = rest.map((letter) => letter.toLowerCase());
    return first.toUpperCase() + restLowerCase.join('');
  }
}

export default new StringFormatter();
