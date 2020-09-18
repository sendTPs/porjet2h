export interface Items {
    name: string;
    description: string;
}

export const sections: Items[] = [
    {
        name: 'Nouveau dessin',
        description:
            'Le bouton \'Nouveau Dessin\' de l\'accueil de l\'application Polydessin permet d\'ouvrir une fenêtre ' +
            'modale contenant les options servant à configurer la surface de dessin. L\'utilisateur peut spécifier les ' +
            'dimensions et la couleur d\'arrière-plan du dessin, celle-ci étant par défaut configurée à blanc. ' +
            'Les champs pour la largeur et la hauteur sont préremplis avec des valeurs (en pixels) permettant de créer ' +
            'la plus grande surface de dessin possible. Celles-ci s\'adaptent donc à l\'écran de l\'appareil de ' +
            'l\'utilisateur. Si la fenêtre du fureteur est redimensionnée, les valeurs par défaut pour la largeur ' +
            'et la hauteur sont affectées en fonction du changement de taille. Si l\'utilisateur modifie au moins une ' +
            'une des deux valeurs, le redimensionnement n\'a aucun impact. Il est possibe d\'ouvrir la modale depuis ' +
            'l\'accueil avec le raccourci Ctrl+O.'
    },
    {
        name: 'Galerie de dessins',
        description:
            'Le bouton \'Galerie Dessins\' permettra d\'ouvrir une galerie de dessins sauvegardés par l\'utilisateur ' +
            'Il s\'agit d\'une fenêtre modale présentant une liste de tous les dessins sauvegardés sur le serveur. Cette ' +
            'liste peut être filtrée en spécifiant une ou plusieurs étiquettes. Lorsqu\'une ou plusieurs étiquettes ' +
            'sont sélectionnées, seulement les dessins qui contiennent au moins une des étiquettes sont visibles. ' +
            'Si aucune étiquette n’est choisie, tous les dessins sont visibles. L\'utilisateur peut aussi supprimer ' +
            'un dessin de la liste. Tous les dessins sont publics. Un utilisateur peut donc ouvrir ou supprimer ' +
            'n\'importe quel dessin.'
    },
    {
        name: 'Vue de dessin',
        description:
            'La vue de dessin correspond à la vue dont l\'utilisateur a accès lors de la création de ses dessins. ' +
            'Elle est composée de plusieurs sections : une barre latérale, un panneau d\'attributs, une surface de ' +
            'dessin et une zone de travail. La barre latérale contient les différents outils de dessin ainsi que les ' +
            'options pour sauvegarder le dessin, quitter la vue, etc. le panneau est composé de contrôles permettant de ' +
            'configurer les attributs de l\'outil actif. La zone de travail occupe tout le reste de la vue et ne contient ' +
            'qu\'une chose : la surface de dessin, qui correspond à la surface sur laquelle il est possible de dessiner.'
    },
    {
        name: 'Continuer dessin / Sauvegarde',
        description:
            'L\'application PolyDessin a un système de sauvegarde automatique, ainsi le dessin se sauvegarde localement lors d\'une ' +
            'modification.' +
            'Un bouton au niveau de l\'entrée sur l\'application permet à l\'utilisateur de reprendre son dessin en cours(qui ' +
            'correspond à la dernière sauvergarde enregistrée). Ce bouton ne s\'affiche pas dans la vue ' + 'd\'accueil s\'' +
            'il n\'y a pas de dessin en cours.'
    },
    {
        name: 'Exporter dessin',
        description:
            'Cette fonctionnalité offre la possibilité de créer une image à partir de la surface de dessin et de ' +
            'l\'exporter dans un des formats suivants : JPG, PNG ou SVG. L’utilisateur devra entrer un nom pour le ' +
            'fichier exporté. S\'il le souhaite, plutôt que de sauvegarder localement le dessin exporté, l\'utilisateur ' +
            'doit pouvoir l\'envoyer par courriel. Dans un tel cas, l\'utilisateur ne devra pas seulement fournir un nom ' +
            'de fichier, mais aussi un nom d\'auteur et l\'adresse du destinataire. La fonctionnalité d\'exportation permet ' +
            'aussi d\'appliquer un filtre sur l\'image avant que l\'exportation ne soit effectuée. Une variété de ' +
            'cinq filtres différents est disponible. Il n\'est possible que d’en appliquer un seul a la fois lors ' +
            'd\'une exportation. Finalement, l\'interface d\'exportation présente une vignette de prévisualisation de ' +
            'l\'image qui sera exportée. La possibilité d\'envoyer son dessin par courriel est aussi disponible pour ' +
            'l\'utilisateur en précisant un couriel de son choix.'
    },
    {
        name: 'Applicateur de couleur',
        description:
            'Cet outil permet de changer la couleur d\'un objet simplement en cliquant dessus. Un clic avec le' +
            'bouton gauche sur un objet fera changer sa couleur pour la couleur principale. Un clic avec le bouton' +
            'droit sur un objet fera changer la couleur de bordure, s\'il en a une, pour la couleur secondaire. Un' +
            'objet dessiné avec l\'option Contour seulement est considéré comme vide, c’est-à-dire que les clics à' +
            'l\'intérieur de l\'objet sont ignorés et il n\'est possible que de changer la couleur de bordure.'
    },
    {
        name: 'Selection et Inversion',
        description:
            'Avec cet outil, l\'utilisateur peut sélectionner un ou plusieurs objets de la surface de dessin. Il lui est' +
            'ensuite possible de les déplacer, de changer leurs dimensions ou de les faire pivoter. Un objet peut' +
            'être dans deux états de sélection : sélectionné ou non sélectionné. Lorsqu\'un objet est sélectionné, ' +
            'une boite englobante l\'entoure. Lorsque plusieurs objets sont sélectionnés, une seule boite qui encadre' +
            'la totalité des objets sélectionnés est créée. Cette boite englobante permet le redimensionnement du ou des' +
            'objets sélectionnés. La sélection est représentée par un \'\' rectangle de sélection\'\' qui s\'active avec le clic gauche ' +
            'et qui est en pointillé lors du déplacement de la souris. ' +
            'Il existe une variante de cette fonctionnalité qui est l\'inversion et qui s\'utilise avec le clic droit cette fois-ci. ' +
            'Son fonctionnement est similaire à celui du rectangle de sélection. La différence est que le rectangle ne définit pas ' +
            'une nouvelle sélection. Il modifie plutôt la sélection existante en inversant l’état de sélection de chaque objet ' +
            'qu’il touche.'
    },
    {
        name: 'Déplacement d\'une sélection',
        description:
            'Une sélection peut être déplacée de deux façons. Soit avec la souris, soit avec le clavier. ' +
            'Le déplacement via la souris s\'effectue à l\'aide d\'un glisser-déposer avec le bouton gauche de la ' +
            'souris. Le déplacement subi par la sélection doit être identique à celui fait par le pointeur de la souris. ' +
            'C\'est-à-dire qu\'en tout temps, donc du début jusqu\'à la fin du déplacement, le point de la sélection' +
            'situé sous le pointeur reste le même. Le déplacement via le clavier se fait à l\'aide des touches directionnelles ' +
            '(les 4 flèches). À chaque fois qu\'une touche directionnelle est appuyée, la sélection se déplace de 3 pixels dans la ' +
            'direction représentée par la touche. Si la touche est maintenue enfoncée, après un délai de 500 ms, une séquence de' +
            'déplacement à répétition débutera. Le déplacement aura donc lieu à toutes les 100 ms jusqu\'à ce que la touche soit relâchée.'
    },
    {
        name: 'Rotation d\'une sélection',
        description:
            'Pour faire pivoter une sélection, il suffit d’utiliser la roulette de la souris. Une sélection pivote autour de ' +
            'son centre. Autrement dit, elle pivote autour du centre de sa boite englobante. Si la touche Shift est maintenue ' +
            'enfoncée pendant la rotation, chaque objet pivotera individuellement sur lui-même (autour de son propre centre). ' +
            'L\'utilisateur peut aussi changer le degré de rotation à l\'aide de la roulette de la souris. À chaque cran de roulette, ' +
            'une rotation de "15" degrés est effectuée. Si la touche ALT est enfoncée, la rotation est de "1" degré. Chaque changement ' +
            'd\'angle d\'une sélection compte comme une action pour l\'outil Annuler-Refaire.'
    },
    {
        name: 'Presse-papier (et manipulation)',
        description:
            'Le presse-papier permet l\'utilisateur d\'utiliser les fonctions couper, copier et coller. ' +
            'Pour éviter un empilement d’objets, un décalage de quelques pixels est appliqué sur la position ' +
            'des objets collés être bien visible. Ainsi, dans le cas de collage à répétition, il sera plus ' +
            'facile de distinguer chaque groupe d’objets collés. ' +
            'Sur le panneaux de configuration, il y a donc cinq boutons correspondants aux cinq fonctionnalités suivantes: ' +
            'couper, copier, coller, dupliquer (une sorte de raccourci pour un copier-coller) et enfin supprimer.'
    },
    {
        name: 'Annuler-Refaire',
        description:
            'L\'application permet d\'annuler les dernières actions que l\'utilisateur a exécutées. Dans ce contexte, une action ' +
            'signifie toute intervention de l\'utilisateur menant à l\'ajout, la suppression ou la modification d\'objets. Les ' +
            'interventions ne touchant pas les données du dessin, par exemple changer d\'outil ou configurer les attributs d\'un outil,  ' +
            'sont donc ignorées. En activant la fonction annuler à répétition, l\'utilisateur peut « reculer » dans l’état de son ' +
            'dessin, et ce jusqu’à en revenir à l\'état de départ. C\'est-à-dire, une surface vide ou le dessin initialement chargé de' +
            'la galerie de dessins. De la même manière, il est possible de refaire une action annulée. Ainsi, il sera possible de refaire' +
            ' chaque action annulée en suivant l\'ordre inverse comme dans une pile dernier entré, premier sorti. Les fonctionnalités ' +
            'Annuler et Refaire ne tiennent pas en compte le presse-papier sauf dans le cas de la modification de la valeur de décalage.'
    },
    {
        name: 'Grille',
        description:
            'L\'application permet d’afficher une grille superposée à la surface de dessin et de son contenu.' +
            'Son point d\'origine est le coin supérieur gauche de la surface. Il est possible d\'activer ou' +
            'désactiver la grille, de lui assigner une valeur de transparence et finalement d\'indiquer la taille (en ' +
            'pixels) des carrés la composant.'
    },
    {
        name: 'Envoyer par mail',
        description:
            'L\'application permet d’afficher une grille superposée à la surface de dessin et de son contenu.' +
            'Son point d\'origine est le coin supérieur gauche de la surface. Il est possible d\'activer ou' +
            'désactiver la grille, de lui assigner une valeur de transparence et finalement d\'indiquer la taille (en ' +
            'pixels) des carrés la composant.'
    },

];
