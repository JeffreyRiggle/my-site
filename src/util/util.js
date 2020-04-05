export const sortProjects = (projects) => {
    return projects.sort((first, second) => {
      const firstName = first.name.toUpperCase();
      const secondName = second.name.toUpperCase();

      if (firstName < secondName) {
        return -1;
      }

      if (firstName > secondName) {
        return 1;
      }

      return 0;
    });
};