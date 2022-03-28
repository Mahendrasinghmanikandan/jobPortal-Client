const roles = [
  {
    id: 1,
    role_name: "Front-end Developer",
    details:
      "A developer who specializes in the programming of visual user interfaces, including its aesthetics and layouts. A front-end developer code runs on a web browser, on the computer of the user of the site.It is very high-level work, normally far removed from the hardware. It requires an understanding of human-machine interaction and design principles more than computer science theory. Much of a front-end developer’s life is spent dealing with cross-browser compatibility issues and tweaking details of the visual presentation of a UI.Front-end development skills include the design of user interface (UI) and user experience (UX), CSS, JavaScript, HTML, and a growing collection of UI frameworks.",
    skills: [
      {
        id: 1,
        name: "HTML",
      },
      {
        id: 2,
        name: "CSS",
      },
      {
        id: 3,
        name: "JQUERY",
      },
      {
        id: 4,
        name: "JAVASCRIPT",
      },
      {
        id: 5,
        name: "REACT JS",
      },
      {
        id: 6,
        name: "ANGULAR JS",
      },
      {
        id: 7,
        name: "VIEW JS",
      },
      {
        id: 8,
        name: "BOOTSTRAP",
      },
      {
        id: 9,
        name: "BACKBONE",
      },
      {
        id: 10,
        name: "ANT DESIGN",
      },
      {
        id: 11,
        name: "METERIAL UI",
      },
      {
        id: 12,
        name: "TYPESCRIPT",
      },
    ],
  },
  {
    id: 2,
    role_name: "Backend Developer",
    details:
      "A developer who specializes in the design, implementation, functional core logic, performance and scalability of a piece of software or system running on machines that are remote from the end-user.Back-end systems can grow to be very complex, but their complexity is often not visible to the users. For example, consider Google search engine. The front-end part is a very simple UI with a title, a text box, and two or three buttons. The backend is an enormously complex system, able to crawl the web, index it, and find what you are looking for with a growing array of sophisticated mechanisms.",
    skills: [
      {
        id: 1,
        name: "PHP",
      },
      {
        id: 2,
        name: "NODE JS",
      },
      {
        id: 3,
        name: "Java",
      },
      {
        id: 4,
        name: "C#",
      },
      {
        id: 5,
        name: "PYTHON",
      },
    ],
  },
  {
    id: 3,
    role_name: "Full-stack Developer",
    details:
      "A developer that does both front-end and back-end work. He or she has the skills required to create a fully functional web application.",
    skills: [
      {
        id: 1,
        name: "PHP",
      },
      {
        id: 2,
        name: "NODE JS",
      },
      {
        id: 3,
        name: "Java",
      },
      {
        id: 4,
        name: "C#",
      },
      {
        id: 5,
        name: "PYTHON",
      },
      {
        id: 6,
        name: "HTML",
      },
    ],
  },
  // {
  //   id: 4,
  //   role_name: "Desktop Developer",
  //   details:
  //     "A developer who works on software applications that run natively on desktop operating systems (such as Mac OS, Windows, and Linux).Back in the ’80s, this was one of the most common types of engineers, popularized by inexpensive development environments such as Turbo Pascal, Turbo C, Visual Basic, Quick C, Visual Studio, and Delphi.",
  //   skills:
  //     "Desktop developers often use GUI Toolkits such as Cocoa, XAML, WinForms, Gtk, etc.",
  // },
  // {
  //   id: 5,
  //   role_name: "Mobile Developer",
  //   details:
  //     "A developer who writes code for applications that run natively on consumer mobile devices such as smartphones and tablets. Mobile development was almost unheard of before the early 2000s and the explosion of the smartphone market. Before then mobile development was considered a subset of embedded development.",
  //   skills:
  //     "A mobile developer understands the intricacies of mobile operating systems such as iOS and Android, and the development environment and frameworks used to write software on those operating systems. That includes Java, Swift, and Objective-C",
  // },
  // {
  //   id: 6,
  //   role_name: "Graphics Developer",
  //   details:
  //     "A type of developer specialized in writing software for rendering, lighting, shadowing, shading, culling, and management of scenes. These developers are often responsible for integrating technologies in the gaming and video production industry.Graphic development used to be a form of low-level development, requiring advanced math and computer science training. It is becoming more accessible with the introduction of commercial and open source frameworks and systems. For example, very few people today need to be able to write a shader from scratch.",
  //   skills:
  //     "Frameworks include DirectX, OpenGL, Unity 3D, WebGL. For more advanced graphic developers, low-level development requires C, C++, and Assembly.",
  // },
  // {
  //   id: 7,
  //   role_name: "Game Developer",
  //   details:
  //     "A generic term to identify a developer specialized in writing games. Game developers can fall into one of the other categories of developers, but they often have specific knowledge and skills in designing and implementing engaging and interactive gaming experiences.",
  //   skills:
  //     "Frameworks used by game developers include DirectX, OpenGL, Unity 3D, WebGL, and languages such as C, C++, and Java. Adobe Flash used to be the standard gaming platform for web games. Since Flash is being abandoned, JavaScript and HTML5 became the new standard. On mobile devices, Swift and Java are now the technologies of choice for iOS and Android games.",
  // },
  // {
  //   id: 8,
  //   role_name: "Data Scientist",
  //   details:
  //     "This type of developer writes software programs to analyze data sets. They are often in charge of statistical analysis, machine learning, data visualization, and predictive modeling.",
  //   skills:
  //     "Languages used by data scientists often include SQL, R, and Python.",
  // },
  {
    id: 9,
    role_name: "for hr",
    details:
      "I include WordPress developers in this list because they are a hefty group of specialized web developers. They create and customize themes and plugins for WordPress and administer WordPress sites.",
    skills: [
      {
        id: 1,
        name: "HTML",
      },
      {
        id: 2,
        name: "CSS",
      },
      {
        id: 3,
        name: "JQUERY",
      },
      {
        id: 4,
        name: "JAVASCRIPT",
      },
      {
        id: 5,
        name: "REACT JS",
      },
      {
        id: 6,
        name: "ANGULAR JS",
      },
      {
        id: 7,
        name: "VIEW JS",
      },
      {
        id: 8,
        name: "BOOTSTRAP",
      },
      {
        id: 9,
        name: "BACKBONE",
      },
      {
        id: 10,
        name: "ANT DESIGN",
      },
      {
        id: 11,
        name: "METERIAL UI",
      },
      {
        id: 12,
        name: "TYPESCRIPT",
      },
      {
        id: 13,
        name: "PHP",
      },
      {
        id: 14,
        name: "NODE JS",
      },
      {
        id: 15,
        name: "Java",
      },
      {
        id: 16,
        name: "C#",
      },
      {
        id: 17,
        name: "PYTHON",
      },
    ],
  },
];

export default roles;
