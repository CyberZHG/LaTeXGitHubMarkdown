FROM ruby

RUN apt-get update -qq && apt-get install -y build-essential
RUN mkdir /app

WORKDIR /app

ADD Gemfile /app/Gemfile
ADD Gemfile.lock /app/Gemfile.lock

RUN bundle install
ADD . /app
