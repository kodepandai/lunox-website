import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

type FeatureItem = {
  title: string;
  // image: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Laravel-Flavoured',
    // image: '/lunox/img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Lunox is Laravel-Flavoured NodeJs Framework. We trying to support all basic Laravel features but we make it as simple as possible.
      </>
    ),
  },
  {
    title: 'Typescript Support',
    // image: '/lunox/img/undraw_docusaurus_tree.svg',
    description: (
      <>
        Lunox is using Typescript by default. This will make development easier to read and debug.
      </>
    ),
  },
  {
    title: 'Artisan',
    // image: '/lunox/img/undraw_docusaurus_react.svg',
    description: (
      <>
        Artisan command on NodeJs environtment? That's cool right. You can make custom artisan command like you do in Laravel.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      {/* <div className="text--center">
        <img className={styles.featureSvg} alt={title} src={image} />
      </div> */}
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
